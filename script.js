
/* =========================
   EMOJIS
========================= */

const emojiBank = [
    "📧","📁","📅","🎥","💬",
    "🌐","⭐","🔥","⚙️","🚀",
    "🎮","📷","📚","🧠","🔒"
];


/* =========================
   GOOGLE GROUP (FULL RESTORED)
========================= */

const GOOGLE_GROUP = {
    id: 1,
    locked: true,
    title: "Google Workspace",
    logo: "img/google/google.png",

    shortcuts: [
        { title:"Gmail", logo:"img/google/gmail.png", link:"https://gmail.com" },
        { title:"Drive", logo:"img/google/drive.png", link:"https://drive.google.com" },
        { title:"Calendar", logo:"img/google/calendar.png", link:"https://calendar.google.com" },
        { title:"Meet", logo:"img/google/meet.png", link:"https://meet.google.com" },
        { title:"Chat", logo:"img/google/chat.png", link:"https://chat.google.com" },
        { title:"Tasks", logo:"img/google/tasks.png", link:"https://tasks.google.com" },
        { title:"Docs", logo:"img/google/docs.png", link:"https://docs.google.com" },
        { title:"Sheets", logo:"img/google/sheets.png", link:"https://sheets.google.com" },
        { title:"Slides", logo:"img/google/slides.png", link:"https://slides.google.com" },
        { title:"Forms", logo:"img/google/forms.png", link:"https://forms.google.com" },
        { title:"Keep", logo:"img/google/keep.png", link:"https://keep.google.com" },
        { title:"Sites", logo:"img/google/sites.png", link:"https://sites.google.com" }
    ]
};


/* =========================
   STATE INIT (SAFE)
========================= */

function getInitialData() {

    const saved = JSON.parse(localStorage.getItem("launchers"));

    if (!saved || !Array.isArray(saved)) {
        return [structuredClone(GOOGLE_GROUP)];
    }

    const hasGoogle = saved.some(g => g.locked);

    if (!hasGoogle) {
        saved.unshift(structuredClone(GOOGLE_GROUP));
    }

    return saved;
}

let launchersData = getInitialData();

let history = [];


/* =========================
   STORAGE
========================= */

function save() {
    localStorage.setItem("launchers", JSON.stringify(launchersData));
}

function pushHistory() {
    history.push(structuredClone(launchersData));
    if (history.length > 50) history.shift();
}


/* =========================
   RESET GLOBAL
========================= */

function resetAll() {

    if (!confirm("Réinitialiser totalement ?")) return;

    launchersData = [structuredClone(GOOGLE_GROUP)];

    history = [];

    save();
    render();
}


/* =========================
   POPUP
========================= */

const popup = document.getElementById("popup");
const t = document.getElementById("popup-title");
const i1 = document.getElementById("popup-input-1");
const i2 = document.getElementById("popup-input-2");
const e = document.getElementById("popup-emoji");

emojiBank.forEach(em => {
    const o = document.createElement("option");
    o.value = em;
    o.textContent = em;
    e.appendChild(o);
});

function openPopup(cfg) {

    popup.style.display = "flex";

    t.textContent = cfg.title;

    i1.value = "";
    i2.value = "";

    i2.style.display = cfg.link ? "block" : "none";
    e.style.display = cfg.emoji ? "block" : "none";

    document.getElementById("popup-confirm").onclick = () => {

        cfg.onConfirm({
            name: i1.value,
            link: i2.value,
            emoji: e.value
        });

        popup.style.display = "none";
    };

    document.getElementById("popup-cancel").onclick = () => {
        popup.style.display = "none";
    };
}


/* =========================
   DRAG & DROP (LOCK SAFE)
========================= */

function enableDrag(container, launcher) {

    if (launcher.locked) return;

    let dragged = null;

    container.querySelectorAll(".shortcut-wrapper").forEach(item => {

        item.draggable = true;

        item.addEventListener("dragstart", () => {
            dragged = item;
            item.classList.add("dragging");
        });

        item.addEventListener("dragend", () => {
            dragged = null;
            item.classList.remove("dragging");

            pushHistory();
            save();
        });

        item.addEventListener("dragover", e => {
            e.preventDefault();

            if (dragged && dragged !== item) {
                container.insertBefore(dragged, item);
            }
        });
    });
}


/* =========================
   RENDER
========================= */

function render() {

    const container = document.getElementById("launchers-container");

    container.innerHTML = "";

    launchersData.forEach(launcher => {

        const div = document.createElement("div");
        div.className = "launcher";

        div.innerHTML = `
            <div class="title">
                <img src="${launcher.logo}">
                <h2>${launcher.title}</h2>
            </div>

            <div class="shortcuts"></div>

            <div class="launcher-actions">

                ${
                    launcher.locked
                    ? `<span style="opacity:0.6;">🔒 Google Workspace</span>`
                    : `
                        <button class="add">＋</button>
                        <button class="undo">↩</button>
                        <button class="reset">🔄</button>
                    `
                }

            </div>
        `;

        const sc = div.querySelector(".shortcuts");


        /* =========================
           SHORTCUTS
        ========================= */

        launcher.shortcuts.forEach(s => {

            const w = document.createElement("div");
            w.className = "shortcut-wrapper";

            w.innerHTML = `
                <a class="shortcut" href="${s.link}" target="_blank">
                    <img src="${s.logo}">
                    <p>${s.title}</p>
                </a>
            `;

            sc.appendChild(w);
        });

        enableDrag(sc, launcher);


        /* =========================
           ACTIONS USER GROUPS
        ========================= */

        if (!launcher.locked) {

            div.querySelector(".add").onclick = () => {

                openPopup({
                    title: "Ajouter raccourci",
                    link: true,
                    emoji: true,

                    onConfirm: (d) => {

                        pushHistory();

                        launcher.shortcuts.push({
                            title: d.name,
                            link: d.link,
                            emoji: d.emoji,
                            logo: null
                        });

                        save();
                        render();
                    }
                });
            };


            div.querySelector(".undo").onclick = () => {

                if (history.length) {
                    launchersData = history.pop();
                    save();
                    render();
                }
            };


            div.querySelector(".reset").onclick = () => {

                pushHistory();

                launcher.shortcuts = [];

                save();
                render();
            };
        }

        container.appendChild(div);
    });
}


/* =========================
   ADD GROUP
========================= */

document.getElementById("add-group").onclick = () => {

    openPopup({
        title: "Créer groupe",
        emoji: true,

        onConfirm: (d) => {

            pushHistory();

            launchersData.push({
                id: Date.now(),
                title: d.name,
                emoji: d.emoji,
                logo: null,
                locked: false,
                shortcuts: []
            });

            save();
            render();
        }
    });
};


/* =========================
   INIT
========================= */

render();