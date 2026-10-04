const SYSTEMS = [
  { key: "reveal", label: "Scroll reveal + stagger", tag: "JS" },
  { key: "mask", label: "Hero name mask", tag: "CSS" },
  { key: "rail", label: "Scroll progress rail", tag: "CSS" },
  { key: "timeline", label: "Timeline draw", tag: "CSS" },
  { key: "thumb", label: "Thumb settle", tag: "CSS" },
  { key: "spotlight", label: "Card spotlight", tag: "JS" },
  { key: "pulse", label: "Status dot pulse", tag: "CSS" },
];

const list = document.getElementById("mpList");

SYSTEMS.forEach((sys) => {
  const row = document.createElement("label");
  row.className = "mp-item" + (window.motionState[sys.key] ? " on" : "");

  const box = document.createElement("span");
  box.className = "mp-box";

  const label = document.createElement("span");
  label.className = "mp-label";
  label.textContent = sys.label;

  const tag = document.createElement("span");
  tag.className = "mp-tag";
  tag.textContent = sys.tag;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = !!window.motionState[sys.key];
  input.className = "visually-hidden-input";
  input.style.cssText = "position:absolute;opacity:0;width:0;height:0";
  input.addEventListener("change", () => {
    row.classList.toggle("on", input.checked);
    window.setMotion(sys.key, input.checked);
  });

  row.append(box, label, tag, input);
  row.addEventListener("click", (e) => {
    if (e.target !== input) {
      input.checked = !input.checked;
      input.dispatchEvent(new Event("change"));
    }
  });

  list.appendChild(row);
});

document.getElementById("mpReplay").addEventListener("click", () => {
  window.replayMotion();
});

document.getElementById("mpAll").addEventListener("click", () => {
  SYSTEMS.forEach((sys) => {
    window.setMotion(sys.key, true);
  });
  list.querySelectorAll(".mp-item").forEach((r, i) => {
    r.classList.add("on");
    r.querySelector("input").checked = true;
  });
  window.replayMotion();
});

const toggle = document.getElementById("mpToggle");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
});
