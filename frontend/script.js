const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

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
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const reply = data.reply || "❌ No response received.";
    appendMessage("Bot", reply);
  } catch (error) {
    appendMessage("Bot", `⚠️ Error: ${error.message}`);
  }
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("copy-btn")) {
    const code = e.target.closest(".code-block").querySelector("code").innerText;
    navigator.clipboard.writeText(code).then(() => {
      e.target.innerText = "Copied!";
      setTimeout(() => {
        e.target.innerText = "Copy";
      }, 1500);
    });
  }
});
