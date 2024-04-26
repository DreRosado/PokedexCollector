document.getElementById("randomizeButton").addEventListener("click", async function () {
    const button = document.getElementById("randomizeButton");
    const pokemonDisplay = document.getElementById("pokemonDisplay");

    button.disabled = true; // Disable the button to prevent multiple clicks
    pokemonDisplay.innerHTML = ""; // Clear previous content

    try {
        const randomIds = generateRandomPokemonIds(12); // Generate an array of 12 random Pokémon IDs
        await fetchRandomPokemonData(randomIds);
    } catch (err) {
        console.error("Error during Pokémon randomization", err);
    } finally {
        button.disabled = false; // Re-enable the button after operations are complete
    }
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

// Updated function to display Pokémon information with types
function displayPokemon(pokemon) {
    const display = document.getElementById("pokemonDisplay");
    const capitalizedPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const types = pokemon.types.map((type) => {
        return type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
    }).join(", ");

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.innerHTML = `
        <h2>${capitalizedPokemonName}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Types: ${types}</p> <!-- Displaying Pokémon's type(s) -->
    `;

    display.appendChild(pokemonCard);
}
// Fetch Pokémon names from your backend and populate the datalist
fetch('/pokemon/?limit=1302') // 
    .then((response) => response.json())
    .then((data) => {
        const pokemonList = document.getElementById("pokemonList");
        data.results.forEach((pokemon) => {
            const option = document.createElement("option");
            option.value = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Capitalize Pokémon names
            pokemonList.appendChild(option);
        });
    })
    .catch((error) => console.error("Error fetching Pokémon list:", error));

document.getElementById("searchButton").addEventListener("click", function () {
    const searchInput = document.getElementById("searchInput").value.trim();

    if (searchInput) {
        fetch(`/pokemon/${searchInput.toLowerCase()}`)
            .then((response) => response.json())
            .then((pokemon) => {
                const display = document.getElementById("pokemonDisplay");
                const capitalizedPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                const capitalizedAbilities = pokemon.abilities.map((ability) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(", ");
                display.innerHTML = `
                <h2>${capitalizedPokemonName}</h2>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>Type: ${pokemon.types.map((type) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(", ")}</p>
            `;
            })
            .catch((error) => {
                console.error("Error fetching Pokémon:", error);
                document.getElementById("pokemonDisplay").innerHTML = "<p>Pokémon not found. Please try again.</p>";
            });
    } else {
        document.getElementById("pokemonDisplay").innerHTML = "<p>Please enter a Pokémon name.</p>";
    }
});