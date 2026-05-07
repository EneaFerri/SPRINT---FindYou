from pydantic import BaseModel, Field


class HotspotRead(BaseModel):
    id: str
    name: str
    municipality: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    score: int = Field(ge=0, le=100)
    priority: str
