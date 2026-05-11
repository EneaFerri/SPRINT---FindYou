"""
Assembles HotspotCluster + business data into Hotspot JSON objects
compatible with the TypeScript Hotspot type in types/hotspot.ts.

Migration path to CCIAA:
  - Replace overpass_client with cciaa_client (same interface)
  - companyMatchStatus changes from 'reale-OSM' to 'reale-CCIAA'
  - mockCompany becomes the real company name from Registro Imprese
  - atecoCode is the official code, not inferred from OSM tags
"""

import math
import requests
from footprint_analyzer import HotspotCluster, BuildingRecord
from ateco_mapper import map_tags, get_description, ATECO_DESCRIPTIONS


# Reverse geocode a lat/lon to get the Italian municipality name.
_NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
_nominatim_cache: dict[tuple, str] = {}
_NOMINATIM_DELAY = 1.1  # seconds — respects Nominatim's 1 req/s policy

# Suppress SSL warnings on macOS Python installs with missing certifi certs
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def _get_municipality(lat: float, lon: float) -> str:
    import time
    key = (round(lat, 3), round(lon, 3))
    if key in _nominatim_cache:
        return _nominatim_cache[key]
    time.sleep(_NOMINATIM_DELAY)
    try:
        resp = requests.get(
            _NOMINATIM_URL,
            params={"lat": lat, "lon": lon, "format": "json", "zoom": 12},
            timeout=15,
            headers={"User-Agent": "BrofindFindYou/1.0 (sales-demo)"},
            verify=False,   # macOS Python 3.13 may lack system CA bundle
        )
        resp.raise_for_status()
        data = resp.json()
        addr = data.get("address", {})
        # zoom=12 → comune/town level; prefer town/village over city (city = province capital)
        name = (
            addr.get("town")
            or addr.get("village")
            or addr.get("suburb")
            or addr.get("city_district")
            or addr.get("city")
            or addr.get("municipality")
            or "Bergamo"
        )
    except Exception:
        name = "Bergamo"
    _nominatim_cache[key] = name
    return name


def _infer_tags_from_cluster(cluster: HotspotCluster) -> dict[str, str]:
    """Collect all OSM tags from buildings in the cluster for ATECO mapping."""
    merged: dict[str, str] = {}
    for b in cluster.buildings:
        for k, v in b.tags.items():
            if k not in merged:
                merged[k] = v
    return merged


def _score_reason(mapping: dict, cluster: HotspotCluster) -> str:
    area_type = mapping["area_type"]
    sqm = cluster.total_sqm
    zone_note = "in zona industriale classificata" if cluster.in_industrial_zone else "area produttiva rilevata da OSM"
    return (
        f"Cluster {area_type} di {sqm:,.0f} sqm ({zone_note}). "
        f"Rischio ATECO {mapping['ateco']}: {mapping['risk']}/100."
    )


def _sales_action(mapping: dict) -> str:
    emissions = ", ".join(mapping["emissions"][:2])
    return (
        f"Verificare aziende presenti su Registro Imprese e avviare primo contatto "
        f"tecnico-commerciale su {emissions}."
    )


def _technical_notes(mapping: dict, cluster: HotspotCluster) -> str:
    dominant = cluster.dominant_building_type
    sqm = cluster.total_sqm
    return (
        f"Edificio predominante: {dominant} ({sqm:,.0f} sqm stimati da poligoni OSM). "
        f"Emissioni potenziali: {', '.join(mapping['emissions'])}."
    )


_BIZ_MATCH_RADIUS_M = 600  # search businesses within this radius of cluster centroid


def _dist_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6_371_000
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def _nearby_biz_tags(
    lat: float,
    lon: float,
    biz_points: list[tuple[float, float, dict]],
) -> dict[str, str]:
    """Merge tags from all businesses within _BIZ_MATCH_RADIUS_M of (lat, lon)."""
    merged: dict[str, str] = {}
    for blat, blon, tags in biz_points:
        if _dist_m(lat, lon, blat, blon) <= _BIZ_MATCH_RADIUS_M:
            for k, v in tags.items():
                if k not in merged:
                    merged[k] = v
    return merged


def build_hotspots(
    clusters: list[HotspotCluster],
    businesses: list[dict],
    max_hotspots: int = 40,
) -> list[dict]:
    """
    Returns a list of dicts matching the TypeScript Hotspot interface.
    max_hotspots caps output to avoid overwhelming the frontend.
    """
    # Pre-parse business points: (lat, lon, tags)
    biz_points: list[tuple[float, float, dict]] = []
    for biz in businesses:
        tags = biz.get("tags", {})
        if biz.get("type") == "node":
            biz_points.append((biz.get("lat", 0), biz.get("lon", 0), tags))
        elif biz.get("center"):
            biz_points.append((biz["center"]["lat"], biz["center"]["lon"], tags))

    # Compute output-relative priority thresholds from the actual input clusters
    capped = clusters[:max_hotspots]
    all_densities = [c.strategic_density for c in capped]
    if all_densities:
        min_d, max_d = min(all_densities), max(all_densities)
        span = max(max_d - min_d, 1)
        high_threshold  = min_d + span * 0.60   # top 40%
        med_threshold   = min_d + span * 0.25   # mid 35%, low 25%
    else:
        high_threshold, med_threshold = 75, 55

    results: list[dict] = []
    for idx, cluster in enumerate(capped, start=1):
        # Merge building tags + nearby business tags for richer ATECO mapping
        cluster_tags = _infer_tags_from_cluster(cluster)
        nearby_tags = _nearby_biz_tags(cluster.centroid_lat, cluster.centroid_lon, biz_points)
        cluster_tags.update(nearby_tags)

        mapping = map_tags(cluster_tags, cluster.dominant_building_type)
        municipality = _get_municipality(cluster.centroid_lat, cluster.centroid_lon)

        sector_labels = {
            "metal treatment":          "Metal Treatment",
            "chemical/plastic":         "Chemical & Plastic",
            "coating/painting":         "Coating District",
            "mechanical manufacturing": "Mechanical Manufacturing",
            "food processing":          "Food Processing",
            "waste treatment":          "Recovery & Waste",
            "large warehouse":          "Logistics Hub",
            "logistics hub":            "Logistics Hub",
            "industrial area":          "Industrial Zone",
        }
        sector_label = sector_labels.get(mapping["area_type"], "Industrial Zone")
        name = f"{municipality} {sector_label} #{idx}"

        # priority relative to output dataset range
        density = cluster.strategic_density
        priority = "high" if density >= high_threshold else ("medium" if density >= med_threshold else "low")

        results.append({
            "id": f"BG-REAL-{idx:03d}",
            "name": name,
            "municipality": municipality,
            "latitude": round(cluster.centroid_lat, 6),
            "longitude": round(cluster.centroid_lon, 6),
            "areaType": mapping["area_type"],
            "mockCompany": "da verificare - fonte OSM",
            "atecoCode": mapping["ateco"],
            "atecoDescription": get_description(mapping["ateco"]),
            "sectorRisk": mapping["risk"],
            "score": 0,                          # enrichHotspotScores() computes this in frontend
            "priority": priority,
            "estimatedSizeSqm": cluster.total_sqm,
            "potentialEmissions": mapping["emissions"],
            "knownAbatementPlant": "non verificato",
            "companyMatchStatus": "reale-OSM",
            "scoreReason": _score_reason(mapping, cluster),
            "suggestedSalesAction": _sales_action(mapping),
            "technicalNotes": _technical_notes(mapping, cluster),
            "internalCollaborationValue": (
                "Dati estratti automaticamente da OpenStreetMap. "
                "Verificare su Registro Imprese prima del contatto."
            ),
            "strategicDensity": cluster.strategic_density,
        })

    return results
