from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import logging
from contextlib import asynccontextmanager
from chatbot_engine import Chatbot
from supabase_client import supabase

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class HealthResponse(BaseModel):
    status: str

chatbot = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global chatbot
    responses_path = os.path.join(os.path.dirname(__file__), "responses.json")
    chatbot = Chatbot(responses_path)
    logger.info("🚀 Chatbot initialized")
    yield
    logger.info("🛑 Shutting down...")

app = FastAPI(
    title="Chatbot Backend API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if not chatbot:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    response = await chatbot.get_response(request.message)

    # Save to Supabase
    try:
        supabase.table("chat_history").insert({
            "user_message": request.message,
            "bot_response": response
        }).execute()
    except Exception as e:
        logger.error(f"Supabase insert error: {e}")

    return ChatResponse(response=response)

@app.get("/")
async def root():
    return {"message": "FastAPI Chatbot Backend", "docs": "/docs"}
