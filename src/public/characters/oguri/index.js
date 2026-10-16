const chatbox = document.querySelector(".chatbox");
const bubble = document.querySelector("#comic-bubble");
const comicText = document.querySelector("#comic-text");

const chibis = [
    document.querySelector("#chibi-1"),
    document.querySelector("#chibi-2")
];

let currentChibi = 0;
let bubbleTimeout;

const facts = [
    'People often called me "Gray Monster" or "Idol Horse"',
    "I was one of the first horses to have official plush dolls!",
    "I won 22 of 32 races with over ¥912 million in earnings!!",
    "I'm just here meanwhile I add more stuff here!"
];

function setChibi(index) {
    currentChibi = index;

    chibis.forEach((chibi, i) => {
        chibi.classList.toggle("active", i === index);
    });
}

function changeChibi() {
    setChibi(currentChibi === 0 ? 1 : 0);
}

function randomFact() {
    comicText.textContent =
        facts[Math.floor(Math.random() * facts.length)];
}

function showBubble() {
    clearTimeout(bubbleTimeout);

    randomFact();
    bubble.classList.add("visible");

    bubbleTimeout = setTimeout(() => {
        bubble.classList.remove("visible");
        bubbleTimeout = null;
        setChibi(0);
    }, 3000);
}

function toggleChat() {
    if (bubble.classList.contains("visible")) {
        showBubble();
        return;
    }

    const isHidden = chatbox.hasAttribute("hidden");

    if (isHidden) {
        chatbox.removeAttribute("hidden");
        changeChibi();
    } else {
        chatbox.setAttribute("hidden", "");
    }

    showBubble();
}