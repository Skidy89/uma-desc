const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");
const loading = $(".loading");
const titleContainer = $(".title-container");
const info = $("#character-info");
const characterInfo = document.getElementById("character-info");

const chibis = {
  meisho: {
    idle: "/images/meisho/MeishoChibi1.webp",
    hoverbtn: "/images/meisho/MeishoChibi2.webp",
    name: "Meisho Doto",
    description: `Meisho doto is a character from the popular game Uma Musume Pretty Derby. She is known for her speed and agility on the racetrack, making her a favorite among fans of the game. This card will redirect you to her page, with a chatbot where you can talk with her.`,
    url: "/characters/meisho",
  },
  oguri: {
    idle: "/images/oguri/OguriCapChibi1.webp",
    hoverbtn: "/images/oguri/Oguri_Cap_Chibi1-2.webp",
    name: "Oguri Cap",
    description: `Also know as the "zombie" or "gray monster", this page will show you information about her.`,
    url: "/characters/oguri",
  },
  goldship: {
    idle: "/images/goldship/chibi1.webp",
    hoverbtn: "/images/goldship/chibi2.webp",
    name: "Gold Ship",
    description: `She is known for her playful and mischievous personality, making her a fan favorite. This page will show you information about her.`,
    url: "/characters/goldship",
  },
};
const characterIdByCardId = {
  doto3: "meisho",
  doto4: "meisho",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function changeBackgroundColor(color) {
  document.body.style.transition = "background-color 0.5s ease";
  document.body.style.backgroundColor = color;
}
// todo
function getAudioForCard() {
  // genuinely what can i put here

  return null;
}

async function playAudioForCard(cardId) {
  const audio = getAudioForCard(cardId);
  await audio.play();
}
async function handleCardHover(card) {
  const cardId = card.id;
  await playAudioForCard(cardId);
}

async function showCardDetails(card) {
  const characterId = characterIdByCardId[card.id] ?? card.id;
  const character = chibis[characterId];

  if (!character) {
    console.warn(`No character details configured for card ${card.id}`);
    return;
  }

  titleContainer.classList.add("fade-out");
  titleContainer.hidden = true;
  characterInfo.dataset.cardId = characterId;
  characterInfo.hidden = false;
  const name = characterInfo.querySelector(".info-name");
  const description = characterInfo.querySelector(".info-description");
  const button = characterInfo.querySelector(".card-btn");
  const buttonImage = button?.querySelector(".card-btn-img");

  name.textContent = character.name;
  description.textContent = character.description;
  if (buttonImage) buttonImage.src = character.idle;

  requestAnimationFrame(() => characterInfo.classList.add("visible"));
}

async function hideCardDetails() {
  characterInfo.classList.remove("visible");
  await sleep(500);
  characterInfo.hidden = true;
}
let isCardSelecting = false;

function selectCard(card) {
  document.querySelectorAll(".card").forEach((other) => {
    if (other !== card) other.hidden = true;
  });

  app.classList.add("is-selected");
  card.classList.add("selected");
  void showCardDetails(card);
}

async function clickCard(card) {
  if (isCardSelecting || card.classList.contains("selected")) return;
  isCardSelecting = true;

  const cardId = card.id;
  console.log(`Card ${cardId} clicked`);
  const color = getComputedStyle(card).backgroundColor;
  changeBackgroundColor(color);
  if (document.startViewTransition) {
    document.startViewTransition(() => selectCard(card));
  } else {
    selectCard(card);
  }
}
async function clickCardbtn(cardId) {
  await sleep(500);
  titleContainer.classList.add("fade-out");
  characterInfo.classList.add("fade-out");
  const color = getComputedStyle(
    document.getElementById(cardId),
  ).backgroundColor;
  changeBackgroundColor(color);
  await sleep(500);
  window.location.href = `/characters/${cardId}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.style.viewTransitionName = `character-${card.id}`;
    card.addEventListener("click", async () => {
      await clickCard(card);
    });
  });

  const continueButton = characterInfo.querySelector(".card-btn");
  const buttonChibi = continueButton?.querySelector(".card-btn-img");

  if (continueButton && buttonChibi) {
    const setButtonChibi = (state) => {
      const characterChibis = chibis[characterInfo.dataset.cardId];
      if (characterChibis) buttonChibi.src = characterChibis[state];
    };

    continueButton?.addEventListener("click", () => {
      setButtonChibi("hoverbtn");
      void clickCardbtn(characterInfo.dataset.cardId);
    });
  }
});

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      img.decode
        ? img
            .decode()
            .catch(() => {})
            .then(resolve)
        : resolve();
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      resolve();
    };
    img.src = src;
  });
}
async function startPreloadingImages() {
  const srcs = [...new Set($$("img").map((img) => img.src))];
  return Promise.race([Promise.all(srcs.map(preloadImage)), sleep(8000)]);
}
async function onloadCutscene() {
  await startPreloadingImages();
  await sleep(100);
  app.hidden = false;
  titleContainer.hidden = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(async () => {
      titleContainer.classList.add("fade-in");
      loading.classList.add("fade-out");

      await sleep(100);
      app.classList.add("fade-in");
    });
  });
}
window.addEventListener("load", onloadCutscene);
