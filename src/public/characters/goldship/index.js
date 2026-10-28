const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const afterbg = "#110101";
const luck = Math.random() < 0.5;
async function transition() {
  const body = document.body;
  const grid = document.querySelector(".grid");
  const background = document.querySelector(".background");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  body.classList.add("transitioning");
  body.style.transition = "background-color 0.5s ease";
  body.style.backgroundColor = afterbg;
  await sleep(500);

  if (reduceMotion) {
    body.classList.add("goldship");
    grid.hidden = false;
    grid.style.opacity = "1";
    grid.style.transition = "opacity 0.5s ease";
    if (background) {
      background.hidden = false;
      background.style.opacity = "1";
    }
    body.classList.remove("transitioning");
    return;
  }

  const flash = document.createElement("div");
  Object.assign(flash.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9999",
    pointerEvents: "none",
    backgroundColor: afterbg,
  });
  body.appendChild(flash);

  await flash.animate(
    [
      { backgroundColor: afterbg, offset: 0 },
      { backgroundColor: "#fff8dc", offset: 0.6 },
      { backgroundColor: "#fff", offset: 1 },
    ],
    { duration: 120, easing: "cubic-bezier(0.7, 0, 1, 1)", fill: "forwards" },
  ).finished;

  body.style.transition = "none";
  body.style.backgroundColor = afterbg;
  body.classList.add("goldship");
  if (background) {
    background.hidden = false;
    background.style.opacity = "1";
  }
  grid.hidden = false;
  grid.style.opacity = "1";
  grid.style.transition = "opacity 0.5s ease";
  await sleep(200);

  await flash.animate(
    [
      { opacity: 1, offset: 0 },
      { opacity: 0.55, offset: 0.25 },
      { opacity: 0.25, offset: 0.6 },
      { opacity: 0, offset: 1 },
    ],
    { duration: 2000, easing: "ease-out", fill: "forwards" },
  ).finished;

  flash.remove();
  body.classList.remove("transitioning");
}

document.addEventListener("DOMContentLoaded", transition);

const el = document.querySelectorAll("[data-sound]");
const superluck = Math.random() < 0.35;
if (superluck) {
  console.log("super luckyyy!");
  function replaceChibisLuck() {
    const stars = document.querySelectorAll(".stars");
    stars.forEach((star) => {
      const chibi = star.querySelector("img");
      if (chibi) {
        chibi.src = `../../images/goldship/trash.png`;
      }
    });
  }
  replaceChibisLuck();
  el.forEach((element) => {
    // pfffffffffffft
    const sound = element.dataset.sound;
    const audio = new Audio(sound);
    audio.preload = "auto";
    element.addEventListener("mouseenter", () => {
      audio.currentTime = 0;
      audio.play();
    });
  });
}
