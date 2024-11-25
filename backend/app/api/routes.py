from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.ai_chat import AIChat, ModelType
from app.config.therapist_config import THERAPISTS 
from typing import Optional
import json
import asyncio


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    therapist: Optional[str] = "janet"
    model: Optional[str] = "mistral"

# Store active chat sessions
chat_sessions = {}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    
    if client_id not in chat_sessions:
        chat_sessions[client_id] = AIChat()
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle different message types
            if message_data.get("type") == "switch_therapist":
                chat_sessions[client_id] = AIChat(
                    therapist_name=message_data["therapist"]
                )
                await websocket.send_json({"type": "system", "content": f"Switched to therapist: {message_data['therapist']}"})
            
            elif message_data.get("type") == "switch_model":
                new_model = ModelType.MISTRAL if message_data["model"] == "mistral" else ModelType.GEMINI
                chat_sessions[client_id].switch_model(new_model)
                await websocket.send_json({"type": "system", "content": f"Switched to model: {new_model.value}"})
            
            elif message_data.get("type") == "message":
                response = await chat_sessions[client_id].send_message(message_data["content"])
                await websocket.send_json({"type": "assistant", "content": response})
    
    except Exception as e:
        await websocket.send_json({"type": "error", "content": str(e)})
    
    finally:
        if client_id in chat_sessions:
            del chat_sessions[client_id]

@app.get("/therapists")
async def get_therapists():
    from therapist_config import THERAPISTS
    return {
        key: {
            "name": therapist.name,
            "description": therapist.description
        } for key, therapist in THERAPISTS.items()
    }