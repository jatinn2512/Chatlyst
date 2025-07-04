cat > README.md << 'EOF'
# 🤖 Chatlyst – Built with FastAPI & Google Gemini API

**Chatlyst** is a modern conversational AI chatbot powered by Google's Gemini API, designed with a responsive chat interface and built using FastAPI.  
It handles real-time user queries and responds intelligently, offering an elegant UI experience.

---

## 🧠 What This Project Does

- Takes user input via a web-based chat UI  
- Sends the message to Gemini API via FastAPI backend  
- Displays AI-generated response in a styled chat layout  
- Supports animated messages, code blocks, copy buttons  
- Clean, responsive, dark-themed interface  

---

## 🛠️ Tech Stack

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend**  | FastAPI (Python) |
| **AI Model** | Gemini 2.5 (via Google Generative AI SDK) |
| **Hosting**  | Netlify (frontend), Render (backend) |

---

## 📂 Project Structure

\`\`\`
Chatlyst/
├── backend/
│   ├── app.py               # FastAPI backend routes
│   ├── gemini_service.py    # Google Gemini API wrapper
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── favicon.ico
\`\`\`

---

## 🔗 Live Demo

🌐 [Chatlyst](https://chatlyst1.netlify.app/)

---

## 🚀 Future Scope

- 🗂 File Upload (PDF, Images, Camera)  
- 🎤 Voice Input (Speech-to-text)  
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
EOF

