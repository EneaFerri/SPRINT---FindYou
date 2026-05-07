from fastapi import APIRouter

from app.models.hotspot import HotspotRead
from app.services.scoring_service import calculate_score_preview

router = APIRouter(prefix="/hotspots", tags=["hotspots"])


@router.get("", response_model=list[HotspotRead])
def list_hotspots() -> list[HotspotRead]:
    """Future endpoint: serve hotspot from PostGIS instead of frontend mock data."""
    return []


@router.get("/score-preview")
def score_preview() -> dict[str, int | str]:
    return {
        "message": "Backend scoring placeholder. Frontend demo uses local scoringEngine.ts.",
        "example_score": calculate_score_preview(),
    }
