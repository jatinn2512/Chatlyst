
const API_URL = "https://chatlyst-1826.onrender.com/chat";

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const form = document.getElementById("input-form");
const fileInput = document.getElementById("file-input");
const attachPreview = document.getElementById("attachment-preview");
const micBtn = document.getElementById("mic-btn");

let isTypingIndicator = false;
let currentAttachment = null;
let recognition = null;
let isRecording = false;

input.focus();

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
}

function formatMessage(text) {
  if (!text) return '';
  
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  let formattedText = text;
  let codeBlocks = [];
  let index = 0;
  
  formattedText = formattedText.replace(codeBlockRegex, (match, lang, code) => {
    const placeholder = `___CODE_BLOCK_${index}___`;
    codeBlocks.push({ lang: lang || 'text', code: code.trim(), placeholder });
    index++;
    return placeholder;
  });

  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
  codeBlocks.forEach(block => {
    const codeBlockHTML = createTerminalCodeBlock(block.code, block.lang);
    formattedText = formattedText.replace(block.placeholder, codeBlockHTML);
  });

  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
}

function createTerminalCodeBlock(code, language) {
  const escapedCode = escapeHtml(code);
  const formattedCode = escapedCode.replace(/\n/g, '<br>');
  
  return `
    <div class="code-block">
      <div class="code-header">
        <span>${language.toUpperCase()}</span>
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
      </div>
      <div class="code-content">
        <pre>${formattedCode}</pre>
      </div>
    </div>
  `;
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function copyCode(button) {
  const codeBlock = button.closest('.code-block');
  const codeContent = codeBlock.querySelector('pre').textContent;
  
  navigator.clipboard.writeText(codeContent).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy code: ', err);
    button.textContent = 'Failed!';
  });
}

function appendBubble({ role = "bot", text = "", time = nowTime(), attachment = null, isTyping = false, animateTypewriter = false }) {
  const el = document.createElement("div");
  el.classList.add(role === "user" ? "user-message" : "bot-message", "bubble");

  const content = document.createElement("div");
  content.className = "message-content";

  if (isTyping) {
    const typingWrap = document.createElement("div");
    typingWrap.className = "typing";
    const dots = document.createElement("div");
    dots.className = "typing-dots";
    dots.innerHTML = "<span></span><span></span><span></span>";
    typingWrap.appendChild(dots);
    content.appendChild(typingWrap);
  } else {
    if (animateTypewriter && role === "bot") {
      content.style.opacity = '0';
      content.style.transform = 'translateY(10px)';
      content.innerHTML = formatMessage(text); 
      content.classList.add('typewriter');
      
      setTimeout(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 100);
    } else {
      content.innerHTML = formatMessage(text); 
    }
    
    if (attachment) {
      const attachEl = document.createElement("div");
      attachEl.style.marginTop = "10px";
      if (attachment.type && attachment.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = attachment.preview || attachment.url;
        img.className = "preview-thumb";
        attachEl.appendChild(img);
      } else {
        const fileChip = document.createElement("div");
        fileChip.className = "preview-chip";
        fileChip.textContent = attachment.name || "file";
        attachEl.appendChild(fileChip);
      }
      content.appendChild(attachEl);
    }
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `${role === "user" ? "You" : "Bot"} • <span class="time">${time}</span>`;

  el.appendChild(content);
  el.appendChild(meta);
  chatBox.appendChild(el);
  scrollToBottom();
}

function showTyping() {
  if (isTypingIndicator) return;
  isTypingIndicator = true;
  appendBubble({ role: "bot", isTyping: true });
}

function removeTyping() {
  if (!isTypingIndicator) return;
  const bubbles = Array.from(chatBox.querySelectorAll(".bot-message"));
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (b.querySelector(".typing")) {
      b.remove();
      break;
    }
  }
  isTypingIndicator = false;
}

// File preview(for future)
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  attachPreview.innerHTML = "";
  currentAttachment = null;
  if (!file) return;
  const previewEl = document.createElement("div");
  previewEl.className = "preview-chip";
  previewEl.textContent = file.name;
  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.className = "preview-thumb";
    img.src = URL.createObjectURL(file);
    previewEl.prepend(img);
  }
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.style.marginLeft = "8px";
  removeBtn.onclick = () => {
    fileInput.value = "";
    attachPreview.innerHTML = "";
    currentAttachment = null;
  };
  previewEl.appendChild(removeBtn);
  attachPreview.appendChild(previewEl);
  currentAttachment = file;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleSend();
});

async function handleSend() {
  const message = input.value.trim();
  if (!message && !currentAttachment) return;

  appendBubble({
    role: "user",
    text: message,
    time: nowTime(),
    attachment: currentAttachment ? { 
      name: currentAttachment.name, 
      type: currentAttachment.type,
      preview: currentAttachment.type.startsWith("image/") ? URL.createObjectURL(currentAttachment) : null 
    } : null
  });

  input.value = "";
  fileInput.value = "";
  attachPreview.innerHTML = "";
  const attachmentToSend = currentAttachment;
  currentAttachment = null;

  showTyping();

  try {
    let responseData;
    if (attachmentToSend) {
      const fd = new FormData();
      fd.append("message", message);
      fd.append("file", attachmentToSend);
      const resp = await fetch(API_URL, { method: "POST", body: fd });
      responseData = await resp.json();
    } else {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      responseData = await resp.json();
    }

    removeTyping();
    const reply = responseData?.reply ?? "Sorry, no response.";
    const attachmentUrl = responseData?.attachmentUrl || null;
    
    appendBubble({ 
      role: "bot", 
      text: reply, 
      time: nowTime(), 
      attachment: attachmentUrl ? { url: attachmentUrl } : null,
      animateTypewriter: true
    });
  } catch (err) {
    removeTyping();
    appendBubble({ role: "bot", text: `⚠️ Error: ${err.message}`, time: nowTime() });
    console.error(err);
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

function initSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.style.display = "none";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let interim = "";
  let finalTranscript = "";

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add("recording");
    micBtn.title = "Recording... click to stop";
  };

  recognition.onend = () => {
    isRecording = false;
    micBtn.classList.remove("recording");
    micBtn.title = "Start/Stop voice input";
  };

  recognition.onresult = (event) => {
    interim = "";
    finalTranscript = "";
    for (let i = 0; i < event.results.length; i++) {
      const res = event.results[i];
      if (res.isFinal) finalTranscript += res[0].transcript;
      else interim += res[0].transcript;
    }
    input.value = (finalTranscript + interim).trim();
  };

  recognition.onerror = (e) => {
    console.warn("Speech recognition error:", e);
  };
}

micBtn.addEventListener("click", () => {
  if (!recognition) initSpeech();
  if (!recognition) return;
  if (!isRecording) recognition.start();
  else recognition.stop();
});

(function init() {
  scrollToBottom();
})();

