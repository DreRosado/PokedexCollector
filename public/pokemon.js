window.onload = function () {
    const pokemonIdOrName = window.location.pathname.split("/").pop(); // Extracts the ID or name from the URL
    fetchAndDisplayPokemon(pokemonIdOrName);
};

async function fetchAndDisplayPokemon(pokemonIdOrName) {
    try {
        const response = await fetch(`/pokemon/${pokemonIdOrName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon data');
        }
        const pokemon = await response.json();
        displayPokemonData(pokemon);
        fetchEvolutionChain(pokemon.species.url);  // Fetch the evolution chain using the species URL
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        document.querySelector('main').innerHTML = "<p>Failed to load Pokémon data. Please try again.</p>";
    }
}

function displayPokemonData(pokemon) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="pokemon-info">
            <img src="${pokemon.sprites.front_default}" alt="Sprite of ${pokemon.name}" class="pokemon-img">
        </div>
        <div class="pokemon-details">
            <h1>${pokemon.name.toUpperCase()}</h1>
            <div class="pokemon-types">${pokemon.types.map(type => `
                <span class="type-button" style="background-color: ${getTypeColor(type.type.name)};">
                    ${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                </span>
            `).join(" ")}</div>
            <p class="pokemon-height">Height: ${pokemon.height / 10} m</p> <!-- Height in meters -->
            <p class="pokemon-weight">Weight: ${pokemon.weight / 10} kg</p> <!-- Weight in kilograms -->
            <div class="pokemon-stats">
                ${pokemon.stats.map(stat => `<p>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</p>`).join("")}
            </div>
            <div class="pokemon-abilities">
                Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(", ").replace(/\b\w/g, l => l.toUpperCase())}
            </div>
        </div>
    `;
}

// Helper function to assign colors based on Pokémon type
function getTypeColor(typeName) {
    const typeColors = {
        normal:     '#B0AC7C',
        fire:       '#F88434',
        water:      '#7094F4',
        electric:   '#FFD434',
        grass:      '#80CC54',
        ice:        '#A0DCDC',
        fighting:   '#C8342C',
        poison:     '#A844A4',
        ground:     '#E8C46C',
        flying:     '#B094F4',
        psychic:    '#FF5C8C',
        bug:        '#B0BC24',
        rock:       '#C0A43C',
        ghost:      '#785C9C',
        dragon:     '#783CFC',
        dark:       '#785C4C',
        steel:      '#C0BCD4',
        fairy:      '#F8B4BC',
    };
    return typeColors[typeName] || '#B0AC7C'; // Default color if type not listed
}

async function fetchEvolutionChain(speciesUrl) {
    try {
        const response = await fetch(speciesUrl);
        const species = await response.json();
        const evolutionChainResponse = await fetch(species.evolution_chain.url);  // Fetch the evolution chain
        const evolutionChain = await evolutionChainResponse.json();
        displayEvolutionChain(evolutionChain);  // Display evolution chain data
    } catch (error) {
        console.error("Error fetching evolution chain:", error);
    }
}

async function displayEvolutionChain(evolutionData) {
    const evolutions = document.createElement('div');
    const evolutionsTitle = document.createElement('h2');
    const evolutionList = document.createElement('div');
    evolutionList.className = 'evolution-list';

    let currentStage = evolutionData.chain;

    while (currentStage) {
        const pokemonName = currentStage.species.name;
        const pokemonDetails = await fetchPokemonDetails(pokemonName);  // Fetch details for each Pokémon
        const pokemonItem = document.createElement('div');
        pokemonItem.className = 'pokemon-evolution-item';
        pokemonItem.innerHTML = `
            <a href="/pokemon-view/${pokemonName}">
                <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonName}" class="pokemon-evolution-image">
                <p class="pokemon-evolution-name">${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</p>
            </a>
        `;
        evolutionList.appendChild(pokemonItem);
        currentStage = currentStage.evolves_to[0];  // Move to the next stage in the evolution chain
    }

    evolutionsTitle.innerHTML = `
        <h2 class="evolutions-title">Evolutions</h2> <!-- Label for the evolutions list -->
    `;

    evolutions.appendChild(evolutionsTitle);
    evolutions.appendChild(evolutionList);

    document.querySelector('main').appendChild(evolutions);
    // document.querySelector('main').appendChild(evolutionList);
}

// Helper function to fetch Pokémon details
async function fetchPokemonDetails(pokemonName) {
    const response = await fetch(`/pokemon/${pokemonName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch details for ${pokemonName}`);
    }
    return await response.json();
}

document.getElementById("hamburgerBtn").addEventListener("click", function(event) {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("visible");

    if (sidebar.classList.contains("visible")) {
        document.querySelector("main").style.paddingLeft = "200px";
    } else {
        document.querySelector("main").style.paddingLeft = "0";
    }

    event.stopPropagation(); // Stop the click event from propagating to the document
});

// Event listener to close the sidebar if clicking outside of it
document.addEventListener("click", function(event) {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("visible") && !sidebar.contains(event.target)) {
        sidebar.classList.remove("visible");
        document.querySelector("main").style.paddingLeft = "0";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('nav a'); // Select all navigation links

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('visible'); // Hide the sidebar
            // Optionally, reset padding if you have padding adjustments
            const contentElements = document.querySelectorAll("main, header, footer");
            contentElements.forEach(element => {
                element.style.paddingLeft = "0"; // Reset padding
            });
        });
    });
});

