"""
Entry point for the Bergamo industrial data extraction pipeline.

Usage:
    cd find-you-demo/backend
    python data_extraction/run_extraction.py

Output:
    ../src/modules/ricerca-clienti/data/bergamo_hotspots_real.json

The script:
  1. Queries Overpass API for industrial zones and buildings in Bergamo province
  2. Clusters buildings by proximity (400 m radius)
  3. Maps OSM tags to ATECO codes
  4. Reverse-geocodes cluster centroids to municipality names
  5. Scores each cluster for industrial potential (RTO candidacy)
  6. Writes JSON compatible with the TypeScript Hotspot type

To migrate to CCIAA when credentials are available:
  - Replace `source = OverpassClient()` with `source = CciaaClient(credentials)`
  - CciaaClient must implement fetch_bergamo_data() returning the same structure
"""

import json
import logging
import sys
import time
from pathlib import Path

# Allow imports from this package when run directly
sys.path.insert(0, str(Path(__file__).parent))

from overpass_client import OverpassClient
from footprint_analyzer import build_hotspot_clusters
from hotspot_builder import build_hotspots

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

OUTPUT_PATH = (
    Path(__file__).parent.parent.parent
    / "src" / "modules" / "ricerca-clienti" / "data" / "bergamo_hotspots_real.json"
)


def main() -> None:
    logger.info("=== Brofind FindYou — Bergamo Data Extraction ===")

    # ── 1. Fetch raw OSM data ──────────────────────────────────────────────
    source = OverpassClient()  # swap with CciaaClient() for CCIAA migration
    raw = source.fetch_bergamo_data()

    n_zones = len(raw["industrial_zones"])
    n_bldgs = len(raw["buildings"])
    n_biz   = len(raw["businesses"])
    logger.info("Fetched: %d industrial zones, %d buildings, %d businesses", n_zones, n_bldgs, n_biz)

    if n_bldgs == 0:
        logger.error("No buildings fetched. Check network / Overpass API availability.")
        sys.exit(1)

    # ── 2. Build footprint clusters ────────────────────────────────────────
    logger.info("Clustering buildings into hotspots...")
    clusters = build_hotspot_clusters(raw["buildings"], raw["industrial_zones"])
    logger.info("Found %d hotspot clusters (≥5,000 sqm)", len(clusters))

    # ── 2b. Stratified sampling for realistic priority distribution ────────
    # clusters is sorted by strategic_density descending.
    # Taking only the top-N would give all "high" priority.
    # Instead: 40% top tier, 40% mid tier, 20% low tier.
    n_total = min(50, len(clusters))
    n_high  = round(n_total * 0.40)
    n_mid   = round(n_total * 0.40)
    n_low   = n_total - n_high - n_mid

    n = len(clusters)
    top_tier  = clusters[:max(1, n // 3)]
    mid_tier  = clusters[n // 3 : 2 * n // 3]
    low_tier  = clusters[2 * n // 3:]

    import random
    random.seed(42)
    sampled = (
        top_tier[:n_high]
        + (random.sample(mid_tier, min(n_mid, len(mid_tier))) if mid_tier else [])
        + (random.sample(low_tier, min(n_low, len(low_tier)))  if low_tier  else [])
    )
    logger.info(
        "Stratified sample: %d high-tier + %d mid-tier + %d low-tier = %d total",
        min(n_high, len(top_tier)),
        min(n_mid,  len(mid_tier)),
        min(n_low,  len(low_tier)),
        len(sampled),
    )

    # ── 3. Assemble Hotspot JSON ───────────────────────────────────────────
    logger.info("Building hotspot objects (reverse geocoding municipalities)...")
    hotspots = build_hotspots(sampled, raw["businesses"], max_hotspots=50)
    logger.info("Generated %d hotspots", len(hotspots))

    # ── 4. Write output ────────────────────────────────────────────────────
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(hotspots, f, ensure_ascii=False, indent=2)

    logger.info("Written → %s", OUTPUT_PATH)
    logger.info("=== Done ===")

    # Quick sanity summary
    priorities = {"high": 0, "medium": 0, "low": 0}
    for h in hotspots:
        priorities[h["priority"]] += 1
    logger.info(
        "Priority breakdown: high=%d  medium=%d  low=%d",
        priorities["high"], priorities["medium"], priorities["low"],
    )


if __name__ == "__main__":
    main()
