import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Lightbox() {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest(".gallery a");
      if (!link) return;
      e.preventDefault();
      setSrc(link.href);
    };
    const onKey = (e) => e.key === "Escape" && setSrc(null);

    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="lightbox"
          onClick={() => setSrc(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={src}
            alt=""
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
