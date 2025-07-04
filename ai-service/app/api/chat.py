from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.chatbot import TravelChatbot
from ..models.travel import TravelRecommendation
from typing import List
router = APIRouter(prefix="/chat", tags=["chat"])
chatbot = TravelChatbot()

class ChatRequest(BaseModel):
    message: str
    preferences: List[str]

class ChatResponse(BaseModel):
    recommendation: TravelRecommendation

@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    try:
        recommendation = await chatbot.chat(request.message, request.preferences)
        return ChatResponse(recommendation=recommendation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))