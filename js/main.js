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

const state = {
    query: "",
    genre: "all",
    sort: "title"
};

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
    remove.type = "button";
    remove.dataset.action = "delete";
    remove.className = "rounded bg-red-100 px-2 py-1 text-sm hover:bg-red-200";
    remove.textContent = "Obriši";

    li.append(text, toggle, remove);
    return li;
}

function visibleFilms() {
    const query = state.query.trim().toLowerCase();

    const filtered = films.filter((film) => {
        const matchesQuery = film.title.toLocaleLowerCase().includes(query);
        const matchesGenre = state.genre === "all" || film.genre === state.genre;
        return matchesQuery && matchesGenre;
    });
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
        film.watched = !film.watched;
    } else if (button.dataset.action === "delete") {
        console.log("Aktivira se");
        
        films.splice(films.findIndex((f) => f.id === id), 1);
    }

    render();
});
document.querySelector("#hint-close").addEventListener("click", () => {
    document.querySelector("hint").remove();
}, {once: true});

//dodavanje novog elementa
const form = document.querySelector("#add-form");
const titleInput = form.elements.title; //  ili document.querySelector("#title")
const  message = document.querySelector("#message");

//validacijske funkcije
function errorMessage(field) {
    const v = field.validity;

    if (v.valueMissing) return "Ovo polje je obavezno.";
    if (v.tooShort) return `Upiši  barem ${field.minLength} znaka.`;
    if (v.badInput) return "Upiši broj.";
    if (v.rangeUnderFlow) return `Najanje ${field.min} min.`;
    if (v.stepMismatch) return `Upiši cijeli broj minuta.`;
    if (v.customError) return field.validationMessage; // iz vlastite validacijske funkcije

    return "";
}

function checkField(field) {
    const text = errorMessage(field); //text sadrži vrijednot  ako polje nije u redu
    document.querySelector(`#${field.id}-error`).textContent = text;
    field.setAttribute("aria-ivalid", text !== "");
    return text === "";  // true, ako je polje u redu, a false ako nije
}

// "custom" validacijska funkcija
function checkUniqeTitle() {
    const title = titleInput.value.trim().toLowerCase(); // naslov pisan u kućicu
    const exists = films.some((film)  => film.title.toLowerCase() === title); //postoji li  takav naslov u listi  filmova
    titleInput.setCustomValidity(exists ? "Film s tim nazovim je  već  na popisu." : "");
}

let submitAttempted = false;

form.addEventListener("submit", (event) => {
    event.preventDefault(); // jako važno !!!

    submitAttempted = true;
    titleInput.value = titleInput.value.trim();
    checkUniqeTitle();
    const fields = [...form.elements].filter((el) =>  el.willValidate && el.required); // [title genre, mnutes]
    const results = fields.map(checkField); // npr. [true, false, true]
    const firstInvalid = fields[results.indexOf(false)]; // npr genre <- orvi ne točan
    //fokusiramo prvi netočan
    if(firstInvalid) {
        firstInvalid.focus();
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    //if (data.title.trim() === "") return; //jednostavna validacija



    films.push({
        id: crypto.randomUUID(),
        title: data.title,
        minutes: Number(data.minutes),
        watched: form.elements.watched.checked
    });

    render();

    message.textContent = `Dodano: ${data.title}`;
    form.reset();
    submitAttempted = false;
    titleInput.focus();
});

form.addEventListener("input", (event) => {
    if (event.target === titleInput) checkUniqeTitle();
    if (submitAttempted && event.target.required) checkField(event.title);
});

render();
