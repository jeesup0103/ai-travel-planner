from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.chatbot import TravelChatbot
from ..models.travel import TravelRecommendation

router = APIRouter(prefix="/chat", tags=["chat"])
chatbot = TravelChatbot()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    recommendation: TravelRecommendation

@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    try:
        recommendation = await chatbot.chat(request.message)
        return ChatResponse(recommendation=recommendation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))