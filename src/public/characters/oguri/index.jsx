import { useState, useRef, useEffect } from "react";

const FACTS = [
  'People often called me "Gray Monster" or "Idol Horse"',
  "I was one of the first horses to have official plush dolls!",
  "I won 22 of 32 races with over ¥912 million in earnings!!",
  "I'm just here meanwhile I add more stuff here!",
];

const CHIBIS = [
  "../../images/oguri/OguriCapChibi1.webp",
  "../../images/oguri/Oguri_Cap_Chibi1-2.webp",
];

export default function Chibi() {
  const [current, setCurrent] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [bubble, setBubble] = useState({ visible: false, text: "..." });
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function showBubble() {
    clearTimeout(timeoutRef.current);
    setBubble({
      visible: true,
      text: FACTS[Math.floor(Math.random() * FACTS.length)],
    });
    timeoutRef.current = setTimeout(() => {
      setBubble((b) => ({ ...b, visible: false }));
      setCurrent(0);
    }, 3000);
  }

  function toggleChat() {
    if (!bubble.visible) {
      if (!chatOpen) setCurrent((c) => (c === 0 ? 1 : 0));
      setChatOpen((open) => !open);
    }
    showBubble();
  }

  return (
    <>
      <div className="character-container" onClick={toggleChat}>
        {CHIBIS.map((src, i) => (
          <img
            key={src}
            src={src}
            id={`chibi-${i + 1}`}
            className={`character-chibi${current === i ? " active" : ""}`}
            alt="Oguri Cap"
          />
        ))}
        <div className={`comic-bubble${bubble.visible ? " visible" : ""}`}>
          <span>{bubble.text}</span>
        </div>
      </div>

      <div className="chatbox" hidden={!chatOpen} />
    </>
  );
}
