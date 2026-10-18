const d = document.querySelector(".black-page-trans");

function fadeOutBlackPage() {
  d.style.display = "block";
  d.style.opacity = "1";

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        d.style.opacity = "0";

        d.addEventListener(
          "transitionend",
          (event) => {
            if (event.propertyName !== "opacity") return;

            d.style.display = "none";
            resolve();
          },
          { once: true },
        );
      });
    });
  });
}

window.addEventListener("load", fadeOutBlackPage, { once: true });
