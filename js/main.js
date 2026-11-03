const films = [
    { id:crypto.randomUUID(), title:"Kumovi", genre: "drama", minutes: 175, watched: true},
    { id:crypto.randomUUID(), title:"Coco", genre: "animirani", minutes: 105, watched: false},
    { id:crypto.randomUUID(), title:"Čudnovate zgode šegrta Hlapića", genre: "animirani", minutes: 80, watched: true},
    { id:crypto.randomUUID(), title:"Život Briana", genre: "komedija", minutes: 94, watched: false},
    { id:crypto.randomUUID(), title:"Moja učiteljica hobotnica", genre: "dokumentarni", minutes: 85, watched: false},
    { id:crypto.randomUUID(), title:"Ne gledaj gore", genre: "komedija", minutes: 138, watched: false},
];

console.log(films);

const list = document.querySelector("#list");
const counter = document.querySelector("#counter");
const empty = document.querySelector("#empty");

function createIteam(film) {
    const li = document.createElement("li");
    li.dataset.id = film.id;
    li.className = "flex items-center gap-2 rounded bg-white p-3 shadow";
    li.classList.toggle("opacity-60", film.watched)

    const text = document.createElement("span");
    text.className = "flex-1";
    text.classList.toggle("line-through", film.watched);
    text.textContent =  `${film.title} - ${film.genre} - ${film.minutes} min`;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.dataset.action = "toggle";
    toggle.className = "rounded bg-emerald-100 px-2 py-1 text-sm hover:bg-emerald-200";
    toggle.textContent = film.watched ? "Vrati" : "Pregledano";

     const remove = document.createElement("button");
    toggle.type = "button";
    toggle.dataset.action = "delete";
    toggle.className = "rounded bg-red-100 px-2 py-1 text-sm hover:bg-red-200";
    toggle.textContent = "Obriši";

    li.append(text, toggle, remove);
    return li;
}

function render() {
    list.replaceChildren(...films.map(createIteam));
}

list.addEventListener("click", (event) => {
    console.log(`target: ${event.target}; currentTarget : ${event.currentTarget}`);

    const button = event.target.closest("[data-action]");
    console.log("Button", button);
    if (!button) return;

    console.log("Idemo dalje");
    const id = button.closest("li").dataset.id;

    if (button.dataset.action === "toggle") {
        const film = films.find((f) => f.id === id);
        film.watched = !film.watched
    } else if (button.dataset.action === "delete") {
        films.slice(films.findIndex((f) => f.id === id), 1);
    }

    render();
});
render();
