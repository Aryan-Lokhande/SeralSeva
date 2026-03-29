from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from model import recommend_schemes

app = FastAPI()

# CORS (important for frontend/backend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    income: int
    category: str

class RecommendRequest(BaseModel):
    user: Dict[str, Any]
    schemes: List[Dict[str, Any]]

@app.get("/")
def home():
    return {"message": "ML Recommendation Service Running"}

# Main recommendation API
@app.post("/recommend")
def recommend(data: RecommendRequest):
    try:
        user_input = data.user
        schemes = data.schemes

        # Fix: Ensure correct types
        user_input["income"] = int(user_input.get("income", 0))
        user_input["category"] = str(user_input.get("category", "")).lower()

        # Call ML logic
        result = recommend_schemes(user_input, schemes)

        return {
            "success": True,
            "recommendations": result
        }

    except Exception as e:
        print("ML ERROR:", str(e))
        return {
            "success": False,
            "message": "ML service error",
            "error": str(e)
        }