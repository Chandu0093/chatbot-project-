from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from chatbot import Chatbot
from supabase_client import supabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("uvicorn")

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class HealthResponse(BaseModel):
    status: str
    chatbot_initialized: bool
    supabase_status: str
    categories_loaded: int = 0

class ChatHistoryResponse(BaseModel):
    id: int
    user_message: str
    bot_response: str
    created_at: str

# Global chatbot instance
chatbot = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    global chatbot
    try:
        # Initialize chatbot
        responses_path = os.path.join(os.path.dirname(__file__), "responses.json")
        chatbot = Chatbot(responses_path)
        logger.info("🚀 Chatbot initialized successfully")

        # Test Supabase connection
        supabase_status = "not configured"
        if supabase:
            try:
                # Try to create table if it doesn't exist
                create_table_sql = """
                CREATE TABLE IF NOT EXISTS chat_history (
                    id BIGSERIAL PRIMARY KEY,
                    user_message TEXT NOT NULL,
                    bot_response TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
                # Note: This SQL execution might need adjustment based on your Supabase setup
                # For now, we'll just try a simple query
                result = supabase.table("chat_history").select("id", count="exact").limit(1).execute()
                supabase_status = "connected"
                logger.info("✅ Supabase connection successful")
            except Exception as e:
                supabase_status = f"disconnected: {str(e)}"
                logger.warning(f"⚠️ Supabase connection issue: {e}")
        else:
            supabase_status = "not configured"
            logger.warning("⚠️ Supabase not configured")

        logger.info(f"📊 Startup completed - Supabase: {supabase_status}")

        yield

    except Exception as e:
        logger.error(f"❌ Failed to initialize application: {e}")
        raise
    finally:
        logger.info("🛑 Shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Chatbot Backend API",
    description="A FastAPI-based chatbot backend with Supabase integration",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ In production, restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with basic information"""
    categories_count = len(chatbot.get_categories()) if chatbot else 0
    return {
        "message": "FastAPI Chatbot Backend",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "chat": "/api/chat",
        "categories_loaded": categories_count,
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    try:
        chatbot_initialized = chatbot is not None
        categories_loaded = len(chatbot.get_categories()) if chatbot else 0
        
        supabase_status = "not configured"
        if supabase:
            try:
                supabase.table("chat_history").select("id", count="exact").limit(1).execute()
                supabase_status = "connected"
            except Exception as e:
                supabase_status = f"disconnected: {str(e)}"
        
        status = "healthy" if chatbot_initialized else "unhealthy"
        
        return HealthResponse(
            status=status,
            chatbot_initialized=chatbot_initialized,
            supabase_status=supabase_status,
            categories_loaded=categories_loaded
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            chatbot_initialized=False,
            supabase_status="error"
        )

@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint"""
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        if not chatbot:
            raise HTTPException(status_code=503, detail="Chatbot not initialized")

        logger.info(f"💬 Processing message: {request.message[:50]}...")
        response = chatbot.get_response(request.message)

        # Save to Supabase if available
        if supabase:
            try:
                supabase.table("chat_history").insert({
                    "user_message": request.message,
                    "bot_response": response,
                    "created_at": datetime.utcnow().isoformat(),
                }).execute()
                logger.info("💾 Chat saved to Supabase")
            except Exception as e:
                logger.error(f"❌ Supabase insert error: {e}")
        else:
            logger.info("💬 Chat processed (Supabase not configured)")

        return ChatResponse(response=response)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/history", tags=["Chat"])
async def get_chat_history(limit: int = 10, offset: int = 0):
    """Get recent chat history"""
    try:
        if not supabase:
            return {"history": [], "message": "Supabase not configured"}
        
        result = (
            supabase.table("chat_history")
            .select("*")
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return {
            "history": result.data,
            "limit": limit,
            "offset": offset,
            "total": len(result.data)
        }
    except Exception as e:
        logger.error(f"❌ Failed to fetch chat history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch chat history")

@app.get("/api/categories", tags=["Chat"])
async def get_categories():
    """Get available response categories"""
    try:
        if not chatbot:
            raise HTTPException(status_code=503, detail="Chatbot not initialized")
        
        categories = chatbot.get_categories()
        return {
            "categories": categories,
            "count": len(categories)
        }
    except Exception as e:
        logger.error(f"❌ Failed to fetch categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")

@app.delete("/api/history/{record_id}", tags=["Chat"])
async def delete_chat_record(record_id: int):
    """Delete a specific chat record"""
    try:
        if not supabase:
            raise HTTPException(status_code=400, detail="Supabase not configured")
        
        result = supabase.table("chat_history").delete().eq("id", record_id).execute()
        
        if result.data:
            return {"message": f"Record {record_id} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Record not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to delete chat record: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete chat record")

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )