const envelope = document.querySelector("#envelope");
const letterNote = document.querySelector("#letter-note");
const hero = document.querySelector(".hero");

// Confetti bursts start at a chosen point and fan out across the screen.
function addConfetti(originElement, count = 120) {
  let overlay = document.querySelector(".confetti-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "confetti-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.append(overlay);
  }

  const bounds = originElement.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;
  const colors = ["#bd4657", "#315f91", "#d5ad62", "#f8f1ec", "#df967e", "#486f9c"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * (count > 80 ? 430 : 230);
    const burstX = Math.cos(angle) * distance;
    const burstY = Math.sin(angle) * distance - 100;
    piece.style.setProperty("--start-x", `${originX}px`);
    piece.style.setProperty("--start-y", `${originY}px`);
    piece.style.setProperty("--burst-x", `${burstX}px`);
    piece.style.setProperty("--burst-y", `${burstY}px`);
    piece.style.setProperty("--burst-spin", `${Math.floor(Math.random() * 800 - 400)}deg`);
    piece.style.setProperty("--land-x", `${burstX + (Math.random() - .5) * 200}px`);
    piece.style.setProperty("--land-y", `${burstY + 260 + Math.random() * 360}px`);
    piece.style.setProperty("--delay", `${Math.random() * (count > 80 ? .7 : .2)}s`);
    piece.style.setProperty("--duration", `${2.8 + Math.random() * (count > 80 ? 2.7 : 1.2)}s`);
    piece.style.setProperty("--spin", `${Math.floor(Math.random() * 1800 - 900)}deg`);
    piece.style.setProperty("--confetti-color", colors[i % colors.length]);
    overlay.append(piece);
    window.setTimeout(() => piece.remove(), 6200);
  }
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addConfetti(hero, 150);
  document.body.classList.add("motion-ready");

  const photoCards = document.querySelectorAll(".photo-group");
  if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    photoCards.forEach((card) => cardObserver.observe(card));
  } else {
    photoCards.forEach((card) => card.classList.add("is-visible"));
  }
}

envelope.addEventListener("click", () => {
  const isOpen = envelope.getAttribute("aria-expanded") === "true";
  const paper = envelope.querySelector(".letter-paper");
  const paperStart = paper.getBoundingClientRect();
  letterNote.getAnimations().forEach((animation) => animation.cancel());
  letterNote.classList.remove("heartbeat");
  envelope.setAttribute("aria-expanded", String(!isOpen));
  envelope.classList.toggle("open", !isOpen);
  letterNote.hidden = isOpen;
  envelope.setAttribute("aria-label", isOpen ? "Open the birthday note" : "Close the birthday note");
  if (!isOpen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addConfetti(envelope, 46);
    requestAnimationFrame(() => {
      const noteEnd = letterNote.getBoundingClientRect();
      const dx = paperStart.left - noteEnd.left;
      const dy = paperStart.top - noteEnd.top;
      const sx = paperStart.width / noteEnd.width;
      const sy = paperStart.height / noteEnd.height;
      const flightLetter = letterNote.cloneNode(true);
      flightLetter.removeAttribute("id");
      flightLetter.removeAttribute("hidden");
      flightLetter.classList.add("letter-flight");
      flightLetter.setAttribute("aria-hidden", "true");
      flightLetter.inert = true;
      flightLetter.style.left = `${noteEnd.left}px`;
      flightLetter.style.top = `${noteEnd.top}px`;
      flightLetter.style.width = `${noteEnd.width}px`;
      flightLetter.style.height = `${noteEnd.height}px`;
      document.body.append(flightLetter);
      letterNote.classList.add("flight-hidden");

      const arcX = dx * .5;
      const arcY = dy * .5 - 130;
      const flightFrames = Array.from({ length: 31 }, (_, frame) => {
        const t = frame / 30;
        const progress = t * t * (3 - 2 * t);
        const inverse = 1 - progress;
        const x = inverse * inverse * dx + 2 * inverse * progress * arcX;
        const y = inverse * inverse * dy + 2 * inverse * progress * arcY;
        const scaleX = sx + (1 - sx) * progress;
        const scaleY = sy + (1 - sy) * progress;
        const tilt = Math.sin(progress * Math.PI * 2) * 3 - inverse * 4;
        return {
          offset: t,
          easing: "linear",
          transformOrigin: "top left",
          transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY}) rotate(${tilt}deg)`
        };
      });
      const flight = flightLetter.animate(flightFrames, { duration: 1650, easing: "linear", fill: "forwards" });

      flight.onfinish = () => {
        flightLetter.remove();
        letterNote.classList.remove("flight-hidden");
        const reveal = letterNote.animate([
          { opacity: 0, transform: "translateY(8px) rotate(-1deg)" },
          { opacity: 1, transform: "translateY(0) rotate(-.5deg)" }
        ], { duration: 280, easing: "ease-out", fill: "both" });
        reveal.onfinish = () => {
          reveal.cancel();
          letterNote.classList.add("heartbeat");
        };
      };
    });
  }
});
