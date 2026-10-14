"use strict";

const meisho = document.getElementById("character-full");
const bg = document.getElementById("bg");
const title = document.getElementById("title");

const box = document.getElementById("chat-box");
const chatform = document.getElementById("chat-form");
const chat = document.getElementById("chat-input");
const message = document.getElementById("chat-messages");
const typing = document.getElementById("chat-typing");

const charid = document.body.dataset.charid || "meisho";
const url = `/api/characters/${encodeURIComponent(charid)}`;
const skey = `conversation:${charid}`;

const conversationId = localStorage.getItem(skey) || crypto.randomUUID();

localStorage.setItem(skey, conversationId);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function fadeIn(element) {
  requestAnimationFrame(() => {
    element.classList.add("fade-in");
  });
}

function scrollToBottom(behavior = "smooth") {
  message.scrollTo({
    top: message.scrollHeight,
    behavior,
  });
}

function addMessage(text, sender, { scroll = true } = {}) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}-message`;

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("span");
  name.className = "message-name";
  name.textContent = sender === "user" ? "You" : "Meisho Doto";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  content.append(name, bubble);
  messageElement.appendChild(content);
  message.appendChild(messageElement);

  if (scroll) scrollToBottom();

  return messageElement;
}

async function sendMessage(text) {
  const response = await fetch(`${url}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, content: text }),
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(result.error || "Message could not be saved");
  }

  if (typeof result.reply !== "string") {
    throw new Error("Invalid server response");
  }

  return result.reply;
}

chatform.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = chat.value.trim();
  if (!text || chat.disabled) return;

  chat.value = "";
  chat.disabled = true;
  typing.hidden = false;

  const userMessage = addMessage(text, "user");

  try {
    const reply = await sendMessage(text);
    addMessage(reply, "character");
  } catch {
    userMessage.remove();
    chat.value = text;

    addMessage("I couldn't save that message. Please try again.", "character");
  } finally {
    typing.hidden = true;
    chat.disabled = false;
    chat.focus();
  }
});

async function loadConversation() {
  try {
    const response = await fetch(
      `${url}/conversations/${encodeURIComponent(conversationId)}/messages`,
    );

    if (!response.ok) return;

    const { messages } = await response.json();
    if (!Array.isArray(messages) || messages.length === 0) return;

    document.querySelector("[data-initial-greeting]")?.remove();

    for (const message of messages) {
      addMessage(
        message.content,
        message.role === "user" ? "user" : "character",
        { scroll: false },
      );
    }

    scrollToBottom("instant");
  } catch {}
}

function animateSubtitles() {
  document.querySelectorAll(".subtitle").forEach((element) => {
    const text = element.textContent;
    const fragment = document.createDocumentFragment();

    for (const char of text) {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.setProperty("--delay", `${Math.random() * -550}ms`);
      fragment.appendChild(span);
    }

    element.replaceChildren(fragment);
  });
}

async function revealCharacter() {
  bg.hidden = false;
  title.hidden = false;
  box.hidden = false;

  await nextFrame();
  await nextFrame();

  bg.classList.add("fade-in");
  title.classList.add("fade-in");

  await sleep(500);

  meisho.hidden = false;

  await nextFrame();
  await nextFrame();

  meisho.classList.add("fade-in");
}

animateSubtitles();
loadConversation();

if (document.readyState === "complete") {
  revealCharacter();
} else {
  window.addEventListener("load", revealCharacter, { once: true });
}
