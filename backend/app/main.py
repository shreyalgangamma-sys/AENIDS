from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
import json
from .database import SessionLocal, FeedbackDB

from .schemas import FlowRequest, AlertResponse, FeedbackRequest
from .inference import analyze_flow

app = FastAPI(title="Adaptive NIDS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "NIDS-backend"}

@app.post("/predict", response_model=AlertResponse)
async def predict_flow(request: FlowRequest):
    alert_id = str(uuid.uuid4())[:8]
    result = analyze_flow(alert_id, request.features, mode=request.mode)
    
    # BROADCAST EVERYTHING
    await manager.broadcast(json.dumps(result))
        
    return result

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    # Open a database session
    db = SessionLocal()
    try:
        # Create a new row in the database
        new_feedback = FeedbackDB(
            alert_id=feedback.alert_id,
            human_label=feedback.human_label,
            notes=feedback.notes
        )
        db.add(new_feedback)
        db.commit()
        
        print(f"✅ SAVED TO DATABASE: Alert {feedback.alert_id} labeled as {feedback.human_label}")
        return {"status": "success", "message": "Feedback saved permanently."}
    except Exception as e:
        print(f"Database Error: {e}")
        return {"status": "error", "message": "Failed to save."}
    finally:
        db.close()