const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const MOTION = {
  reveal: true,
  mask: true,
  rail: true,
  timeline: true,
  thumb: true,
  spotlight: true,
  pulse: true,
};

function splitHeroName() {
  const h1 = document.querySelector(".hero-name");
  if (!h1 || h1.dataset.split === "done") return;
  h1.dataset.split = "done";

  const mask = document.createElement("span");
  mask.className = "mask";

  const words = h1.textContent.trim().split(/\s+/);

  h1.setAttribute("aria-label", words.join(" "));
  mask.setAttribute("aria-hidden", "true");

  words.forEach((word) => {
    const line = document.createElement("span");
    line.className = "mask-line";
    const inner = document.createElement("span");
    inner.className = "mask-in";
    inner.textContent = word;
    line.appendChild(inner);
    mask.appendChild(line);
  });

  h1.textContent = "";
  h1.appendChild(mask);
  return mask;
}

const maskEl = splitHeroName();

const REVEALABLE = ".skill-group, .project-card, .contact-card, .badge, .timeline-item";

document.querySelectorAll(".split-body").forEach((body) => {
  Array.from(body.children).forEach((group, gi) => {
    const items = Array.from(group.querySelectorAll(REVEALABLE));

    if (items.length > 1) {
      items.forEach((item, i) => {
        item.setAttribute("data-reveal", "");
        item.style.setProperty("--d", 90 + gi * 80 + i * 55 + "ms");
      });
      return;
    }

    group.setAttribute("data-reveal", "");
    group.style.setProperty("--d", gi * 90 + "ms");
  });
});

const heroInner = document.querySelector(".hero-inner");
if (heroInner) {
  heroInner.setAttribute("data-hero", "");
}

let observer = null;

function observe() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (MOTION.reveal || el.hasAttribute("data-hero")) {
          el.classList.add("in");
        }
        if (MOTION.mask && el.classList.contains("mask")) {
          el.classList.add("in");
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );

  document
    .querySelectorAll("[data-reveal], [data-hero], .mask")
    .forEach((el) => observer.observe(el));
}

function primeHero() {
  if (!heroInner) return;
  if (MOTION.reveal) {
    requestAnimationFrame(() => heroInner.classList.add("in"));
  } else {
    heroInner.classList.add("in");
  }
  if (maskEl && MOTION.mask) {
    setTimeout(() => maskEl.classList.add("in"), 120);
  } else if (maskEl) {
    maskEl.classList.add("in");
  }
}

function applyFlags() {
  const off = Object.entries(MOTION)
    .filter(([, on]) => !on)
    .map(([k]) => k);

  document.body.classList.toggle("motion-off", off.includes("reveal"));

  const rail = document.querySelector(".scroll-rail");
  if (rail) rail.style.display = off.includes("rail") ? "none" : "";

  document.querySelectorAll(".timeline-draw").forEach((el) => {
    el.style.animationPlayState = off.includes("timeline") ? "paused" : "";
    if (off.includes("timeline")) el.style.transform = "scaleY(1)";
  });

  document.querySelectorAll(".card-glow").forEach((el) => {
    el.style.display = off.includes("spotlight") ? "none" : "";
  });

  document.querySelectorAll(".status-dot").forEach((el) => {
    el.style.animation = off.includes("pulse") ? "none" : "";
  });

  document.querySelectorAll(".project-thumb").forEach((el) => {
    if (off.includes("thumb")) el.style.transform = "scale(1)";
  });
}

function addSpotlight() {
  document.querySelectorAll(".project-card, .contact-card").forEach((card) => {
    if (card.querySelector(".card-glow")) return;

    const glow = document.createElement("span");
    glow.className = "card-glow";
    glow.setAttribute("aria-hidden", "true");
    card.insertBefore(glow, card.firstChild);

    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      glow.style.setProperty("--mx", e.clientX - r.left + "px");
      glow.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
}

const rail = document.createElement("div");
rail.className = "scroll-rail";
rail.setAttribute("aria-hidden", "true");
document.body.appendChild(rail);

if (!CSS.supports("animation-timeline: scroll()")) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    rail.style.transform = "scaleY(" + (max > 0 ? window.scrollY / max : 0) + ")";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

addSpotlight();
primeHero();
observe();
applyFlags();

window.motionState = MOTION;
window.setMotion = (key, value) => {
  MOTION[key] = value;
  applyFlags();
  observe();
};

window.replayMotion = () => {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.remove("in"));
  if (maskEl) maskEl.classList.remove("in");
  if (heroInner) heroInner.classList.remove("in");
  void document.body.offsetWidth;
  observe();
  primeHero();
};
