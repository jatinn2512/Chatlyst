const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const micButton = document.getElementById("mic-btn");
const fileInput = document.getElementById("file-input");

function appendMessage(role, message) {
  const div = document.createElement("div");
  div.className = role === "You" ? "user-msg" : "bot-msg";

  if (message.includes("```")) {
    const parts = message.split("```");
    let html = "";
    parts.forEach((part, i) => {
      if (i % 2 === 0) {
        html += `<div>${part.trim()}</div>`;
      } else {
        html += `
        <div class="code-block">
          <div class="code-header">
            Code
            <button class="copy-btn">Copy</button>
          </div>
          <pre><code>${part.trim()}</code></pre>
        </div>`;
      }
    });
    div.innerHTML = `<b>${role}:</b><br>${html}`;
  } else {
    div.innerHTML = `<b>${role}:</b> ${message}`;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  const file = fileInput.files[0];

  if (!message && !file) return;

  if (message) appendMessage("You", message);
  if (file) appendMessage("You", `📁 Sent file: ${file.name}`);

  input.value = "";
  fileInput.value = "";

  const formData = new FormData();
  formData.append("message", message);
  if (file) formData.append("file", file);

  try {
    const res = await fetch("https://chatlyst-fyf5.onrender.com/chat", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const reply = data.reply || "❌ No response received.";
    appendMessage("Bot", reply);
  } catch (error) {
    appendMessage("Bot", `⚠️ Error: ${error.message}`);
  }
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("copy-btn")) {
    const code = e.target.closest(".code-block").querySelector("code").innerText;
    navigator.clipboard.writeText(code).then(() => {
      e.target.innerText = "Copied!";
      setTimeout(() => (e.target.innerText = "Copy"), 1500);
    });
  }
});

micButton.addEventListener("click", () => {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    alert("Speech Recognition not supported on your browser.");
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    input.value += transcript;
  };

  recognition.start();
});
