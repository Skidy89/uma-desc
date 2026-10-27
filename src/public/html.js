function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const chibis = {
  meisho: {
    idle: "/images/meisho/MeishoChibi1.webp",
    hoverbtn: "/images/meisho/MeishoChibi2.webp",
  },
};

const loading = document.querySelector(".loading");
const app = document.getElementById("app");
const titleContainer = document.querySelector(".title-container");
const characterInfo = document.getElementById("character-info");

// todo
function getAudioForCard(cardId) {
  const audioMap = {
    1: "/audio/1.mp3",
    2: "/audio/2.mp3",
    3: "/audio/3.mp3",
    4: "/audio/4.mp3",
  };
  const audio = new Audio(audioMap[cardId]);

  return audio;
}

async function playAudioForCard(cardId) {
  const audio = getAudioForCard(cardId);
  await audio.play();
}
async function stopAudioForCard(cardId) {
  const audio = getAudioForCard(cardId);
  audio.pause();
  audio.currentTime = 0;
}
async function handleCardHover(card) {
  const cardId = card.id;
  await playAudioForCard(cardId);
}

async function handleCardHoverOut(card) {
  const cardId = card.id;
  await stopAudioForCard(cardId);
}
async function showCardDetails(card) {
  titleContainer.classList.add("fade-out");
  titleContainer.hidden = true;
  characterInfo.dataset.cardId = card.id;
  characterInfo.hidden = false;
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
  document.body.style.transition = "background-color 0.5s ease";
  document.body.style.backgroundColor = getComputedStyle(
    document.getElementById(cardId),
  ).backgroundColor;
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

window.addEventListener("load", async () => {
  setTimeout(() => {
    app.hidden = false;
    titleContainer.hidden = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        titleContainer.classList.add("fade-in");
        loading.classList.add("fade-out");

        await sleep(500);
        app.classList.add("fade-in");
      });
    });
  }, 500);
});
