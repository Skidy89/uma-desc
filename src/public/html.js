function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const loading = document.querySelector(".loading");
const app = document.getElementById("app");
const titleContainer = document.querySelector(".title-container");

async function clickCard(card) {
  const cardId = card.id;

  card.style.viewTransitionName = `character-${cardId}`;

  document.querySelectorAll(".card").forEach((other) => {
    if (other !== card) {
      other.classList.add("fade-out");
    }
  });
  await sleep(500);
  titleContainer.classList.add("fade-out");
  card.classList.add("fade-out");
  document.body.style.transition = "background-color 0.5s ease";
  document.body.style.backgroundColor = getComputedStyle(card).backgroundColor;
  await sleep(500);
  window.location.href = `/characters/${cardId}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      await clickCard(card);
    });
  });
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
