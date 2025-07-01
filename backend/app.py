from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from gemini_service import get_llm_response

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data["message"]
    reply = get_llm_response(message)
    return {"reply": reply}
