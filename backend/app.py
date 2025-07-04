from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("models/gemini-2.5-pro")


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message")

    try:
        response = model.generate_content(user_input)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"❌ Gemini API Error: {str(e)}"}
