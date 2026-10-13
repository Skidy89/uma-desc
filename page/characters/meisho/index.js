const meisho = document.getElementById("character-full");
const bg = document.getElementById("bg");
const title = document.getElementById("title");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
document.querySelectorAll(".subtitle").forEach((el) => {
  const text = el.textContent;
  el.replaceChildren();

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.setProperty(
      "--delay",
      `${Math.random() * -550}ms`
    );
    el.appendChild(span);
  });
});
window.addEventListener("load", async () => {
  bg.hidden = false;
  title.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bg.classList.add("fade-in");
      title.classList.add("fade-in")
    });
});
  await sleep(500);
  meisho.hidden = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      meisho.classList.add("fade-in");
    });
  });
});