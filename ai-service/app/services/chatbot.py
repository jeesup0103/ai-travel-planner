import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from ..models.travel import TravelRecommendation
from .maps_service import MapsService
from ..core.config import settings


class TravelChatbot:
    def __init__(self):
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY required")

        self.llm = ChatOpenAI(model="gpt-4.1-nano", api_key = api_key, temperature=0.7)
        self.maps = MapsService()

        # Create chain with structured output
        self.chain = (
            ChatPromptTemplate.from_messages([
                ("system", """You are a travel assistant. When users ask for travel help:
                            1. Extract locations and preferences from their message
                            2. Suggest routes between locations
                            3. Recommend interesting places to visit
                            4. Provide helpful travel
                            5. Make a summarized string response of the travel suggestions
                            Always respond with structured travel recommendations."""),
                ("human", "{message}")
            ])
            | self.llm.with_structured_output(TravelRecommendation)
        )

    async def chat(self, message: str) -> TravelRecommendation:
        try:
            response = await self.chain.ainvoke({"message": message})

            enhanced_routes = []
            for route in response.routes:
                if route.origin and route.destination:
                    real_route = self.maps.get_directions(route.origin, route.destination, route.mode)
                    if real_route:
                        enhanced_routes.append(real_route)
                    else:
                        enhanced_routes.append(route)
                else:
                    enhanced_routes.append(route)

            response.routes = enhanced_routes
            return response

        except Exception as e:
            print(f"Error in chat: {e}")
            return TravelRecommendation(
                query=message,
                routes=[],
                tips=["Sorry, I encountered an error. Please try again."],
                summaryResponse=[]
            )