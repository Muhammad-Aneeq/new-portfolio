// Skills data - edit this array to change skills
const skillGroups = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { label: "Frontend", items: ["React", "Next.js"] },
  { label: "AI & backend", items: ["OpenAI GPT", "LangChain", "Dialogflow", "Node.js", "REST APIs"] },
  { label: "Tooling", items: ["Git & GitHub"] },
];

// Hero transcript - edit this object to change the hero conversation
const transcript = {
  answer:
    "LangChain with pgvector on Postgres for retrieval, OpenAI for embeddings and generation, and a thin Node service in front of it. Cache the FAQ answers before you ever call the model \u2014 most support traffic repeats.",
};

const skillsGrid = document.getElementById("skillsGrid");

skillGroups.forEach((group) => {
  const wrapper = document.createElement("div");
  wrapper.className = "skill-group";

  const label = document.createElement("p");
  label.className = "skill-group-label";
  label.textContent = group.label;

  const list = document.createElement("ul");

  group.items.forEach((item) => {
    const entry = document.createElement("li");
    entry.textContent = item;
    list.appendChild(entry);
  });

  wrapper.append(label, list);
  skillsGrid.appendChild(wrapper);
});

// Navbar scroll effect
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
    updateActiveLink();
  },
  { passive: true }
);

// Highlight active section link
function updateActiveLink() {
  const probe = navbar.offsetHeight + 52;
  let current = "";

  document.querySelectorAll("section[id]").forEach((section) => {
    if (window.scrollY >= section.offsetTop - probe) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

updateActiveLink();

// Mobile hamburger menu
const hamburger = document.getElementById("hamburger");
const mobileLinks = document.querySelector(".nav-links");

function setMenu(open) {
  hamburger.classList.toggle("open", open);
  mobileLinks.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
}

hamburger.addEventListener("click", () => {
  setMenu(!hamburger.classList.contains("open"));
});

// Close mobile menu when a link is clicked
mobileLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenu(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && hamburger.classList.contains("open")) {
    setMenu(false);
    hamburger.focus();
  }
});

// Hero transcript typewriter
const answerEl = document.getElementById("transcriptAnswer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  answerEl.textContent = transcript.answer;
} else {
  const characters = transcript.answer.split("");
  answerEl.classList.add("typing");

  let typed = 0;

  const typeNext = () => {
    typed += 1;
    answerEl.textContent = characters.slice(0, typed).join("");

    if (typed < characters.length) {
      setTimeout(typeNext, 18 + Math.random() * 34);
    } else {
      answerEl.classList.remove("typing");
    }
  };

  setTimeout(typeNext, 500);
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Hero name split into masked lines
const heroName = document.querySelector(".hero-name");
const heroInner = document.querySelector(".hero-inner");
let heroMask = null;

if (heroName && !reduceMotion) {
  const words = heroName.textContent.trim().split(/\s+/);

  heroName.setAttribute("aria-label", words.join(" "));

  heroMask = document.createElement("span");
  heroMask.className = "mask";
  heroMask.setAttribute("aria-hidden", "true");

  words.forEach((word) => {
    const line = document.createElement("span");
    line.className = "mask-line";

    const inner = document.createElement("span");
    inner.className = "mask-in";
    inner.textContent = word;

    line.appendChild(inner);
    heroMask.appendChild(line);
  });

  heroName.textContent = "";
  heroName.appendChild(heroMask);
}

// Scroll reveal targets
const REVEALABLE = ".skill-group, .project-card, .contact-card, .badge, .timeline-item";

document.querySelectorAll(".split-body").forEach((body) => {
  Array.from(body.children).forEach((group, groupIndex) => {
    const items = Array.from(group.querySelectorAll(REVEALABLE));

    if (items.length > 1) {
      items.forEach((item, itemIndex) => {
        item.setAttribute("data-reveal", "");
        item.style.setProperty(
          "--d",
          90 + groupIndex * 80 + itemIndex * 55 + "ms"
        );
      });
      return;
    }

    group.setAttribute("data-reveal", "");
    group.style.setProperty("--d", groupIndex * 90 + "ms");
  });
});

const pendingReveals = new Set(
  Array.from(document.querySelectorAll("[data-reveal]"))
);

const revealObserver = new IntersectionObserver(sweepReveals, {
  threshold: 0.1,
  rootMargin: "0px 0px -6% 0px",
});

function sweepReveals() {
  pendingReveals.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.94) {
      el.classList.add("in");
      pendingReveals.delete(el);
      revealObserver.unobserve(el);
    }
  });

  if (pendingReveals.size === 0) {
    window.removeEventListener("scroll", queueSweep);
    window.removeEventListener("resize", queueSweep);
  }
}

let sweepQueued = false;

function queueSweep() {
  if (sweepQueued) return;
  sweepQueued = true;
  requestAnimationFrame(() => {
    sweepQueued = false;
    sweepReveals();
  });
}

pendingReveals.forEach((el) => {
  revealObserver.observe(el);
});

window.addEventListener("scroll", queueSweep, { passive: true });
window.addEventListener("resize", queueSweep);
window.addEventListener("load", queueSweep);
sweepReveals();

// Card cursor spotlight
document.querySelectorAll(".project-card, .contact-card").forEach((card) => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const glow = document.createElement("span");
  glow.className = "card-glow";
  glow.setAttribute("aria-hidden", "true");
  card.insertBefore(glow, card.firstChild);

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    glow.style.setProperty("--mx", event.clientX - rect.left + "px");
    glow.style.setProperty("--my", event.clientY - rect.top + "px");
  });
});

// Scroll progress rail
const rail = document.createElement("div");
rail.className = "scroll-rail";
rail.setAttribute("aria-hidden", "true");
document.body.appendChild(rail);

if (!CSS.supports("animation-timeline: scroll()")) {
  const updateRail = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    rail.style.transform = "scaleY(" + (max > 0 ? window.scrollY / max : 0) + ")";
  };

  window.addEventListener("scroll", updateRail, { passive: true });
  updateRail();
}

// Hero entrance
if (heroInner) {
  if (reduceMotion) {
    heroInner.classList.add("in");
    if (heroMask) heroMask.classList.add("in");
  } else {
    requestAnimationFrame(() => heroInner.classList.add("in"));
    if (heroMask) {
      setTimeout(() => heroMask.classList.add("in"), 60);
    }
  }
}
