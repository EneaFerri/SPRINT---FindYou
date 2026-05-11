"""
Estimates industrial building footprint areas from OSM polygon geometry
and clusters nearby buildings into hotspot candidates.

Scalability note: score_building_cluster() combines multiple weighted factors.
Adding a future satellite NDBI index is just one more entry in the factors dict
with its own weight — the rest of the pipeline stays unchanged.
"""

import math
from collections import Counter
from dataclasses import dataclass, field


@dataclass
class BuildingRecord:
    osm_id: int
    lat: float
    lon: float
    area_sqm: float
    building_type: str          # industrial / warehouse / factory / yes / …
    tags: dict = field(default_factory=dict)
    name: str = ""


@dataclass
class HotspotCluster:
    buildings: list[BuildingRecord]
    centroid_lat: float
    centroid_lon: float
    total_sqm: float
    dominant_building_type: str
    strategic_density: int      # 0-100 composite score
    in_industrial_zone: bool


# ── Geometry helpers ─────────────────────────────────────────────────────────

def _haversine_sqm(coords: list[list[float]]) -> float:
    """
    Approximate area in square metres of a closed polygon given as
    [[lon, lat], ...] using the Shoelace formula on a local flat projection.
    Accurate enough for buildings up to ~1 km across.
    """
    if len(coords) < 3:
        return 0.0
    R = 6_371_000  # Earth radius in metres
    lat0 = math.radians(sum(c[1] for c in coords) / len(coords))
    cos_lat = math.cos(lat0)

    def to_m(lon, lat):
        return (math.radians(lon) * R * cos_lat, math.radians(lat) * R)

    pts = [to_m(c[0], c[1]) for c in coords]
    n = len(pts)
    area = 0.0
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2


def _polygon_centroid(coords: list[list[float]]) -> tuple[float, float]:
    """Returns (lat, lon) centroid of a polygon."""
    lats = [c[1] for c in coords]
    lons = [c[0] for c in coords]
    return sum(lats) / len(lats), sum(lons) / len(lons)


def _dist_m(lat1, lon1, lat2, lon2) -> float:
    """Haversine distance in metres between two points."""
    R = 6_371_000
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


# ── OSM element → BuildingRecord ─────────────────────────────────────────────

def parse_buildings(elements: list[dict]) -> list[BuildingRecord]:
    """Convert raw Overpass building elements into BuildingRecord objects."""
    records: list[BuildingRecord] = []
    for el in elements:
        tags = el.get("tags", {})
        geom = el.get("geometry", [])
        if not geom or el.get("type") != "way":
            continue

        coords = [[n["lon"], n["lat"]] for n in geom if "lon" in n]
        if len(coords) < 3:
            continue

        area = _haversine_sqm(coords)
        if area < 500:          # ignore tiny sheds
            continue

        lat, lon = _polygon_centroid(coords)
        records.append(BuildingRecord(
            osm_id=el["id"],
            lat=lat,
            lon=lon,
            area_sqm=area,
            building_type=tags.get("building", "yes").lower(),
            tags=tags,
            name=tags.get("name", tags.get("operator", "")),
        ))
    return records


# ── Industrial zone lookup ────────────────────────────────────────────────────

def build_zone_index(zone_elements: list[dict]) -> list[tuple[float, float, float, float]]:
    """
    Returns a list of (min_lat, min_lon, max_lat, max_lon) bboxes for each
    industrial zone — used for fast point-in-zone checks.
    """
    bboxes = []
    for el in zone_elements:
        geom = el.get("geometry", [])
        if not geom:
            bounds = el.get("bounds", {})
            if bounds:
                bboxes.append((bounds["minlat"], bounds["minlon"], bounds["maxlat"], bounds["maxlon"]))
            continue
        lats = [n["lat"] for n in geom if "lat" in n]
        lons = [n["lon"] for n in geom if "lon" in n]
        if lats and lons:
            bboxes.append((min(lats), min(lons), max(lats), max(lons)))
    return bboxes


def point_in_any_zone(lat: float, lon: float, zone_bboxes: list) -> bool:
    for min_lat, min_lon, max_lat, max_lon in zone_bboxes:
        if min_lat <= lat <= max_lat and min_lon <= lon <= max_lon:
            return True
    return False


# ── Clustering ───────────────────────────────────────────────────────────────

CLUSTER_RADIUS_M = 400  # metres — buildings within this radius form one hotspot
MIN_HOTSPOT_SQM = 5_000  # discard tiny isolated buildings


def cluster_buildings(buildings: list[BuildingRecord]) -> list[list[BuildingRecord]]:
    """
    Greedy radius clustering: assign each building to the first existing cluster
    whose centroid is within CLUSTER_RADIUS_M, otherwise start a new cluster.
    O(n²) — fine for the hundreds of buildings we expect in Bergamo province.
    """
    clusters: list[list[BuildingRecord]] = []
    centroids: list[tuple[float, float]] = []

    for b in buildings:
        assigned = False
        for i, (clat, clon) in enumerate(centroids):
            if _dist_m(b.lat, b.lon, clat, clon) <= CLUSTER_RADIUS_M:
                clusters[i].append(b)
                # Update centroid incrementally
                n = len(clusters[i])
                centroids[i] = (
                    (clat * (n - 1) + b.lat) / n,
                    (clon * (n - 1) + b.lon) / n,
                )
                assigned = True
                break
        if not assigned:
            clusters.append([b])
            centroids.append((b.lat, b.lon))

    return clusters


# ── Scoring ──────────────────────────────────────────────────────────────────

_BUILDING_TYPE_WEIGHTS = {
    "factory":     1.00,
    "manufacture": 0.95,
    "industrial":  0.90,
    "warehouse":   0.70,
    "yes":         0.50,
}

def score_building_cluster(
    cluster: list[BuildingRecord],
    in_industrial_zone: bool,
    area_percentile: float = 0.5,
) -> tuple[int, float]:
    """
    Returns (strategic_density 0-100, total_sqm).

    Factor breakdown (scalable: add satellite NDBI as a new weighted factor):
      - area_percentile      (40%): relative size within the full dataset
      - building_type_score  (35%): dominant building type (industrial/factory/warehouse)
      - zone_score           (25%): whether the cluster is inside a landuse=industrial polygon
    """
    total_sqm = sum(b.area_sqm for b in cluster)

    types = [b.building_type for b in cluster]
    dominant_type = Counter(types).most_common(1)[0][0]
    building_type_score = _BUILDING_TYPE_WEIGHTS.get(dominant_type, 0.50)

    zone_score = 1.0 if in_industrial_zone else 0.55

    composite = (
        area_percentile      * 0.40
        + building_type_score * 0.35
        + zone_score          * 0.25
    )
    return round(composite * 100), round(total_sqm)


# ── Public API ────────────────────────────────────────────────────────────────

def build_hotspot_clusters(
    building_elements: list[dict],
    zone_elements: list[dict],
) -> list[HotspotCluster]:
    """Full pipeline: raw OSM elements → list of HotspotCluster objects."""
    buildings = parse_buildings(building_elements)
    zone_bboxes = build_zone_index(zone_elements)

    raw_clusters = cluster_buildings(buildings)

    # First pass: collect all valid clusters and their raw areas
    valid: list[tuple[list[BuildingRecord], float, float, float, bool, str]] = []
    for cluster in raw_clusters:
        total_sqm = sum(b.area_sqm for b in cluster)
        if total_sqm < MIN_HOTSPOT_SQM:
            continue
        lats = [b.lat for b in cluster]
        lons = [b.lon for b in cluster]
        centroid_lat = sum(lats) / len(lats)
        centroid_lon = sum(lons) / len(lons)
        in_zone = point_in_any_zone(centroid_lat, centroid_lon, zone_bboxes)
        dominant_type = Counter(b.building_type for b in cluster).most_common(1)[0][0]
        valid.append((cluster, centroid_lat, centroid_lon, total_sqm, in_zone, dominant_type))

    # Compute per-cluster area percentile across the full valid dataset
    all_areas = sorted(v[3] for v in valid)
    n = len(all_areas)

    hotspots: list[HotspotCluster] = []
    for cluster, centroid_lat, centroid_lon, total_sqm, in_zone, dominant_type in valid:
        rank = sum(1 for a in all_areas if a <= total_sqm)
        area_percentile = rank / n if n > 0 else 0.5

        strategic_density, total_sqm_rounded = score_building_cluster(
            cluster, in_zone, area_percentile
        )
        hotspots.append(HotspotCluster(
            buildings=cluster,
            centroid_lat=centroid_lat,
            centroid_lon=centroid_lon,
            total_sqm=total_sqm_rounded,
            dominant_building_type=dominant_type,
            strategic_density=strategic_density,
            in_industrial_zone=in_zone,
        ))

    # Sort by strategic density descending
    hotspots.sort(key=lambda h: h.strategic_density, reverse=True)
    return hotspots
