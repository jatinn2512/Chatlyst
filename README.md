# 🤖 Chatlyst – Built with FastAPI & Google Gemini API

**Chatlyst** is a modern conversational AI chatbot powered by Google's Gemini API, designed with a responsive chat interface and built using FastAPI.  
It handles real-time user queries and responds intelligently, offering an elegant UI experience.

---

## 🧠 What This Project Does

- Takes user input via a web-based chat UI (text or voice 🎤)  
- Sends the message to Gemini API via FastAPI backend  
- Displays AI-generated response in a styled chat layout  
- Supports animated messages, voice input (speech-to-text), code blocks, copy buttons  
- Clean, responsive, dark-themed interface  
  

---

## 🛠️ Tech Stack

| Layer        | Tool / Library                              |
|--------------|----------------------------------------------|
| Frontend     | `HTML`, `CSS`, `JavaScript`                 |
| Backend      | `FastAPI (Python)`                          |
| AI Model     | `Gemini 2.5 (via Google Generative AI SDK)` |
| Hosting      | `Netlify` (frontend), `Render` (backend)    |

## 📂 Project Structure

```
Chatlyst/
├── backend/
│   ├── app.py               # FastAPI backend entry point
│   ├── gemini_service.py    # Gemini API integration logic
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── index.html           # Main UI layout
│   ├── style.css            # Custom dark theme styling
│   ├── script.js            # Chat functionality & animations
│   └── favicon.ico          # App icon
```


## 🔗 Live Demo

🌐 [Chatlyst](https://chatlyst1.netlify.app/)

---

## 🚀 How to Run the Bot

🧩 1. Install Backend Dependencies  
Navigate to the `backend` folder and install the required Python packages:

```bash
cd backend
pip install -r requirements.txt
```
▶️ 2. Set Up Your API Key
Create a .env file inside the backend folder and add your Gemini API key:
```bash
GEMINI_API_KEY=your_api_key_here
```
▶️ 3. Start the FastAPI Server

```bash
uvicorn app:app --reload
```
🌐 This will start the backend at: (your local server)

💬 4. Open the Frontend
Open the `index.html` file inside the `frontend` folder in your browser
(or use a Live Server extension in VS Code).

That's it — start chatting with Chatlyst! 🤖

## 🚀 Future Scope

- 🗂 File Upload (PDF, Images, Camera) 
- 🎤 Improved Voice Input (multi-language speech-to-text)  
- 🧠 Chat Memory & Context Handling  
- 🌗 Dark/Light Theme Mode Toggle  
- 🔐 API Key Encryption  
- 💬 Personas & Custom Prompts  

---

## 🙋‍♂️ Author

Made with ❤️ by **Jatin Kumar**  
📧 jxtron25@gmail.com  
🌐 [GitHub](https://github.com/jxtron25)  
🔗 [LinkedIn](https://www.linkedin.com/in/jatin-kumar-jk2512/)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).


