document.getElementById("randomizeButton").addEventListener("click", function() {
    const randomIds = generateRandomPokemonIds(12); // Generate an array of 12 random Pokémon IDs
    fetchRandomPokemonData(randomIds);
});

// Function to generate an array of random Pokémon IDs
function generateRandomPokemonIds(count) {
    const randomIds = [];
    for (let i = 0; i < count; i++) {
        randomIds.push(Math.floor(Math.random() * 898) + 1); // Assuming there are 898 Pokémon in total
    }
    return randomIds;
}

// Function to fetch data for random Pokémon IDs and display them
async function fetchRandomPokemonData(ids) {
    const pokemonDisplay = document.getElementById("pokemonDisplay");
    pokemonDisplay.innerHTML = ""; // Clear previous content

    for (const id of ids) {
        try {
            const response = await fetch(`/pokemon/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Pokémon with ID ${id}`);
            }
            const pokemon = await response.json();
            displayPokemon(pokemon);
        } catch (error) {
            console.error("Error fetching Pokémon data:", error);
        }
    }
}

// Function to display Pokémon information
function displayPokemon(pokemon) {
    const display = document.getElementById("pokemonDisplay");
    const capitalizedPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const capitalizedAbilities = pokemon.abilities.map((ability) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(", ");

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.innerHTML = `
        <h2>${capitalizedPokemonName}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Type: ${pokemon.types.map((type) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(", ")}</p>
    `;

    display.appendChild(pokemonCard);
}