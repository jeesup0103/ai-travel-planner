import os
import googlemaps
from typing import List, Optional
from ..models.travel import Place, Route
from ..core.config import settings

class MapsService:
    def __init__(self):
        api_key = settings.GOOGLE_MAPS_API_KEY
        if not api_key:
            raise ValueError("GOOGLE_MAPS_API_KEY required")
        self.gmaps = googlemaps.Client(key=api_key)

    def search_places(self, query: str, location: str = "New York") -> List[Place]:
        try:
            # Geocode location
            geocode = self.gmaps.geocode(location)
            if not geocode:
                return []

            lat, lng = geocode[0]['geometry']['location'].values()

            # Search places
            places = self.gmaps.places(
                query,
                location=(lat, lng),
                radius=10000
            )

            return [
                Place(
                    name=place.get('name', ''),
                    address=place.get('formatted_address', ''),
                    rating=place.get('rating')
                )
                for place in places.get('results', [])[:5]
            ]
        except Exception as e:
            print(f"Error searching places: {e}")
            return []

    def get_directions(self, origin: str, destination: str, mode: str = "driving") -> Optional[Route]:
        try:
            directions = self.gmaps.directions(origin, destination, mode=mode)
            if not directions:
                return None

            leg = directions[0]['legs'][0]
            return Route(
                origin=leg['start_address'],
                destination=leg['end_address'],
                distance=leg['distance']['text'],
                duration=leg['duration']['text'],
                mode=mode
            )
        except Exception as e:
            print(f"Error getting directions: {e}")
            return None