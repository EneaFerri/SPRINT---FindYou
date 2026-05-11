"""
Fetches industrial zone data for Bergamo province from the Overpass API.

Interface contract (duck-typing):
  client = OverpassClient()
  data = client.fetch_bergamo_data()
  # returns: {"industrial_zones": [...], "buildings": [...], "businesses": [...]}

A future CciaaClient must implement the same fetch_bergamo_data() signature
so hotspot_builder.py requires no changes on migration.
"""

import time
import logging
import requests

logger = logging.getLogger(__name__)

# Bergamo province bounding box: south, west, north, east
BERGAMO_BBOX = "45.40,9.40,45.92,10.10"
REQUEST_TIMEOUT = 90  # seconds

# Try multiple public Overpass endpoints in order
_OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
]


def _query(ql: str) -> dict:
    """POST an Overpass QL query, trying each endpoint with one retry each."""
    last_exc: Exception | None = None
    for endpoint in _OVERPASS_ENDPOINTS:
        for attempt in range(2):
            try:
                logger.debug("Trying %s (attempt %d)", endpoint, attempt + 1)
                resp = requests.post(
                    endpoint,
                    data={"data": ql},
                    timeout=REQUEST_TIMEOUT,
                    headers={"User-Agent": "BrofindFindYou/1.0 (sales-demo)"},
                )
                resp.raise_for_status()
                return resp.json()
            except (requests.exceptions.Timeout, requests.exceptions.HTTPError) as e:
                last_exc = e
                if attempt == 0:
                    wait = 5
                    logger.warning("%s failed: %s — retrying in %ds", endpoint, e, wait)
                    time.sleep(wait)
            except requests.exceptions.RequestException as e:
                last_exc = e
                break  # connection error — try next endpoint immediately
    raise RuntimeError(f"All Overpass endpoints failed. Last error: {last_exc}")


class OverpassClient:
    """Fetches raw OSM data for industrial areas in Bergamo province."""

    def fetch_bergamo_data(self) -> dict:
        logger.info("Fetching industrial zones from Overpass API...")
        zones = self._fetch_industrial_zones()
        time.sleep(2)  # be polite to the free API

        logger.info("Fetching building footprints...")
        buildings = self._fetch_buildings()
        time.sleep(2)

        logger.info("Fetching industrial businesses...")
        businesses = self._fetch_businesses()

        return {
            "industrial_zones": zones,
            "buildings": buildings,
            "businesses": businesses,
        }

    def _fetch_industrial_zones(self) -> list[dict]:
        """Ways and relations tagged landuse=industrial."""
        ql = f"""
        [out:json][timeout:45];
        (
          way["landuse"="industrial"]({BERGAMO_BBOX});
          relation["landuse"="industrial"]({BERGAMO_BBOX});
        );
        out body geom;
        """
        data = _query(ql)
        return data.get("elements", [])

    def _fetch_buildings(self) -> list[dict]:
        """Building polygons classified as industrial, warehouse, or factory."""
        ql = f"""
        [out:json][timeout:45];
        (
          way["building"~"^(industrial|warehouse|factory|manufacture)$"]({BERGAMO_BBOX});
        );
        out body geom;
        """
        data = _query(ql)
        return data.get("elements", [])

    def _fetch_businesses(self) -> list[dict]:
        """
        Nodes and small ways with craft/industrial/man_made tags that indicate
        manufacturing or processing activity.
        """
        ql = f"""
        [out:json][timeout:45];
        (
          node["craft"]({BERGAMO_BBOX});
          node["industrial"]({BERGAMO_BBOX});
          node["man_made"~"^(works|plant|storage_tank|petroleum_well)$"]({BERGAMO_BBOX});
          way["craft"]({BERGAMO_BBOX});
          way["industrial"]["industrial"!="yes"]({BERGAMO_BBOX});
          way["man_made"~"^(works|plant)$"]({BERGAMO_BBOX});
        );
        out body center;
        """
        data = _query(ql)
        return data.get("elements", [])
