const wrapper = document.querySelector("#pokemons");
const button = document.querySelector("button");
const input = document.querySelector("input");

let limit = 20;
let offset = 0;

const type = document.querySelector("#list");

let displayPokemon = [];

const URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;


// FETCH DATA

async function getData(URL) {

    const response = await fetch(URL);

    const data = await response.json();

    return data;
}


// SHOW DATA

function showData(abilities) {

    wrapper.innerHTML = "";

    abilities.forEach((obj) => {

        let card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

        <div class="card-inner">

            <div class="card-front">

                <img 
                    src="${obj.sprites.other.dream_world.front_default}" 
                    class="image"
                >

                <h2 class="name">
                    ${obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
                </h2>

                <p class="type">
                    Type: ${obj.types[0].type.name}
                </p>

            </div>


            <div class="card-back">

                <h3>${obj.name}</h3>

                <p><strong>Height:</strong> ${obj.height}</p>

                <p><strong>Weight:</strong> ${obj.weight}</p>

                <p><strong>HP:</strong> ${obj.stats[0].base_stat}</p>

                <p><strong>Attack:</strong> ${obj.stats[1].base_stat}</p>

                <p><strong>Defense:</strong> ${obj.stats[2].base_stat}</p>

                <p><strong>Special Attack:</strong> ${obj.stats[3].base_stat}</p>

                <p><strong>Special Defense:</strong> ${obj.stats[4].base_stat}</p>

                <p><strong>Speed:</strong> ${obj.stats[5].base_stat}</p>

            </div>

        </div>
        `;

        wrapper.append(card);

    });
}


// LOAD TYPES

async function loadTypes() {

    const data = await getData("https://pokeapi.co/api/v2/type");

    data.results.forEach((obj) => {

        let option = document.createElement("option");

        option.value = obj.name;

        option.innerText =
            obj.name.charAt(0).toUpperCase() +
            obj.name.slice(1);

        type.append(option);

    });
}


// ENTRY POINT

window.addEventListener("load", async () => {

    const data = await getData(URL);

    const arr = data.results;

    const promises = arr.map((obj) => getData(obj.url));

    const abilities = await Promise.all(promises);

    displayPokemon = [...abilities];

    showData(displayPokemon);

    loadTypes();

});



button.addEventListener("click", async () => {

    offset += limit;

    let load = await getData(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    let promise = load.results.map((i) =>
        getData(i.url)
    );

    let allPoke = await Promise.all(promise);

    displayPokemon = [...displayPokemon, ...allPoke];

    showData(displayPokemon);

});



input.addEventListener("keyup", () => {

    const searchString = input.value.toLowerCase();

    const result = displayPokemon.filter((obj) => {

        return obj.name.toLowerCase().includes(searchString);

    });

    showData(result);

});



type.addEventListener("change", () => {

    const selectedType = type.value;

    if (selectedType === "all") {

        showData(displayPokemon);

        return;
    }

    const filteredPokemon = displayPokemon.filter((obj) => {

        return obj.types.some((item) => {

            return item.type.name === selectedType;

        });

    });

    showData(filteredPokemon);

});