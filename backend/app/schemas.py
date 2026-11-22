from pydantic import BaseModel
from typing import List, Dict, Any

class FlowRequest(BaseModel):
    features: Dict[str, Any]
    mode: str = "auto"

class ShapFeature(BaseModel):
    feature: str
    value: float
    impact: float

class AlertResponse(BaseModel):
    alert_id: str
    status: str
    classification: str
    shap_explanation: List[ShapFeature]
    human_review_required: bool
    review_options: List[str]

class FeedbackRequest(BaseModel):
    alert_id: str
    human_label: str
    notes: str = ""