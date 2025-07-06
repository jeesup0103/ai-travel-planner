from typing import List, Optional
from pydantic import BaseModel, Field


class Place(BaseModel):
    """Basic place information."""
    name: str = Field(..., description="Name of the place")
    address: str = Field(..., description="Address of the place")
    rating: Optional[float] = Field(None, description="Rating (0-5)")
    lat: Optional[float] = Field(None, description="Latitude coordinate")
    lng: Optional[float] = Field(None, description="Longitude coordinate")


class Route(BaseModel):
    """Travel route information."""
    origin: str = Field(..., description="Starting location")
    destination: str = Field(..., description="Ending location")
    distance: str = Field(..., description="Total distance")
    duration: str = Field(..., description="Estimated travel time")
    mode: str = Field(default="driving", description="Transportation mode")


class TravelRecommendation(BaseModel):
    """Travel recommendation response."""
    query: str = Field(..., description="Original user query")
    routes: List[Route] = Field(..., description="Recommended routes")
    places: List[Place] = Field(default_factory=list, description="Recommended places")
    tips: List[str] = Field(default_factory=list, description="Travel tips")
    summaryResponse: str = Field(..., description="Summarized response about routes and places and tips.")