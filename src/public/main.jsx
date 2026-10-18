import { createRoot } from "react-dom/client";
import OguriChibi from "./characters/oguri/index.jsx";
import Lightbox from "./characters/oguri/lightBox.jsx";
import Reveal from "./characters/oguri/Reveal.jsx";

const components = {
  "oguri-chibi": OguriChibi,
  lightbox: Lightbox,
  reveal: Reveal,
};

document.querySelectorAll("[data-react-component]").forEach((element) => {
  const Component = components[element.dataset.reactComponent];
  if (Component) createRoot(element).render(<Component />);
});
