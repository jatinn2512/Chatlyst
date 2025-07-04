import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-pro")


def get_llm_response(message: str) -> str:
    try:
        response = model.generate_content(message)
        return response.text
    except Exception as e:
        return f"❌ Error: {e}"
