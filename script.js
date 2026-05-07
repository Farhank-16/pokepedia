const wrapper = document.querySelector("#pokemons")
const button = document.querySelector("button")
const input = document.querySelector("input")
let limit = 20;
let offset = 0;
const type = document.querySelector("#list")
let displayPokemon = [];

const URL  = `https://pokeapi.co/api/v2/pokemon?$limit=${limit}&offset=${offset}`;


async function getData(URL) {
    const response = await fetch(URL);

    const data =  await response.json()
    // console.log(data)
    return data
}

function showData (abilities){
   
    wrapper.innerHTML = "";
    abilities.forEach((obj) => {
        
    let card = document.createElement("div");
    let pokemonImage = document.createElement("img")
    let h2 = document.createElement("h2")
    let type = document.createElement("p")
    
    h2.classList.add("name")
    card.classList.add("card")
    type.classList.add("type")

    h2.innerText = obj.name.charAt(0).toUpperCase() + obj.name.slice(1).toLowerCase();;
    type.innerHTML = `<strong>Type: </strong>${obj.types[0].type.name}`;
    pokemonImage.src = obj.sprites.other.dream_world.front_default;
    card.append(pokemonImage,h2,type);
    wrapper.append(card);

});
    
}

//Entry point
window.addEventListener("load", async ()=>{
    const data = await getData(URL);
    const arr = data.results;

    const promises = arr.map((obj) => getData(obj.url));
    const abilities = await Promise.all(promises);
    displayPokemon = [...abilities]
    
    let uniqueTypes = new Set();

    abilities.forEach((obj) => {

        const pokemonType =
          obj.types[0].type.name;

        uniqueTypes.add(pokemonType);

    });

    uniqueTypes.forEach((pokeType) => {

        let option =
          document.createElement("option");

        option.value = pokeType;

        option.innerText =
          pokeType.charAt(0).toUpperCase() +
          pokeType.slice(1);

        type.append(option);

    });

    showData(abilities);
    loadTypes();

});


button.addEventListener("click", async ()=>{
    offset += limit;
    let load = await getData(`https://pokeapi.co/api/v2/pokemon?$limit=${limit}&offset=${offset}`);

    let promise = load.results.map((i) =>
    getData(i.url)
    )
    let allPoke = await Promise.all(promise);

    displayPokemon = [...displayPokemon, ...allPoke];

    showData(displayPokemon);
})

input.addEventListener("keyup", () => {
    const searchString = input.value;
    const result = displayPokemon.filter((obj) => obj.name.includes(searchString));
    // console.log(result);
    showData(result);
})


async function loadTypes() {

    const data = await getData(
        "https://pokeapi.co/api/v2/type"
    );

    data.results.forEach((obj) => {

        let option = document.createElement("option");

        option.value = obj.name;

        option.innerText =
            obj.name.charAt(0).toUpperCase() +
            obj.name.slice(1);

        type.append(option);

    });
}

type.addEventListener("change", () => {

    const selectedType = type.value;

    if(selectedType === "all"){

        showData(displayPokemon);

        return;
    }

    const filteredPokemon = displayPokemon.filter((obj) => {

        return obj.types[0].type.name === selectedType;

    });

    showData(filteredPokemon);

});


function showData(abilities) {

    wrapper.innerHTML = "";
  
    abilities.forEach((obj) => {
  
      let card = document.createElement("div");
  
      card.classList.add("card");
  
      card.innerHTML = `
  
        <div class="card-inner">
  
          <!-- FRONT SIDE -->
  
          <div class="card-front">
  
            <img 
              src="${obj.sprites.other.dream_world.front_default}" 
              class="image"
            >
  
            <h2 class="name">
              ${obj.name}
            </h2>
  
            <p class="type">Type: 
              ${obj.types[0].type.name}
            </p>
  
          </div>
  
  
          <div class="card-back">
  
            <h3>${obj.name}</h3>
  
            <p>
              <strong>Height:</strong> ${obj.height} cm
            </p>
  
            <p>
              <strong>Weight:</strong> ${obj.weight} kg
            </p>
  
            <p>
              <strong>HP:</strong> ${obj.stats[0].base_stat}
            </p>
  
            <p>
              <strong>Attack:</strong> ${obj.stats[1].base_stat}
            </p>
  
            <p>
              <strong>Defense:</strong> ${obj.stats[2].base_stat}
            </p>
  
            <p>
              <strong>Special Attack:</strong> ${obj.stats[3].base_stat}
            </p>
  
            <p>
              <strong>Special Defense:</strong> ${obj.stats[4].base_stat}
            </p>
  
            <p>
              <strong>Speed:</strong> ${obj.stats[5].base_stat}
            </p>
  
          </div>
  
        </div>
      `;
  
      wrapper.append(card);
  
    });
  }