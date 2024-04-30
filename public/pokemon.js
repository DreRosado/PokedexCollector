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
    } catch (error) {
        console.log(222);
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
            <p>Types: ${pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(", ")}</p>
        </div>
    `;
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

