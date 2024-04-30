document.getElementById("hamburgerBtn").addEventListener("click", function (event) {
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
document.addEventListener("click", function (event) {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("visible") && !sidebar.contains(event.target)) {
        sidebar.classList.remove("visible");
        document.querySelector("main").style.paddingLeft = "0";
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('nav a'); // Select all navigation links

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            sidebar.classList.remove('visible'); // Hide the sidebar
            // Optionally, reset padding if you have padding adjustments
            const contentElements = document.querySelectorAll("main, header, footer");
            contentElements.forEach(element => {
                element.style.paddingLeft = "0"; // Reset padding
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('nav a'); // Select all navigation links

    // Add event listeners for nav links to close sidebar
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            sidebar.classList.remove('visible'); // Hide the sidebar
            const contentElements = document.querySelectorAll("main, header, footer");
            contentElements.forEach(element => {
                element.style.paddingLeft = "0"; // Reset padding
            });
        });
    });

    // Fetch and display the Pokémon team
    fetch('/my-team')
        .then(response => response.json())
        .then(team => {
            if (team && Object.values(team).length) {
                displayTeam(team);
            } else {
                console.log('No Pokémon team found or team is empty.');
            }
        })
        .catch(error => console.error('Failed to load Pokémon team:', error));

    // Function to display each Pokémon in the team
    async function displayTeam(team) {
        const pokemonDisplay = document.getElementById("pokemonDisplay");
        pokemonDisplay.innerHTML = ""; // Clear previous content

        let anySuccessful = false; // Track if any fetch is successful

        for (const key in team) {
            const pokemonId = team[key];
            try {
                const response = await fetch(`/pokemon/${pokemonId}`);
                if (!response.ok) throw new Error(`Failed to fetch Pokémon with ID ${pokemonId}`);
                const pokemon = await response.json();

                const pokemonCard = document.createElement("div");
                pokemonCard.classList.add("pokemon-card");
                pokemonCard.innerHTML = `
                    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p>Types: ${pokemon.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ')}</p>
                    <p>Stats: ${pokemon.stats.map(s => s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1) + ': ' + s.base_stat).join(', ')}</p>
                    <p>Top Moves: ${pokemon.moves.map(m => m.move.name.charAt(0).toUpperCase() + m.move.name.slice(1)).slice(0, 5).join(', ')}</p>
                `;
                pokemonDisplay.appendChild(pokemonCard);
                anySuccessful = true; // Set to true if any Pokémon is successfully fetched
            } catch (error) {
                console.error(`Error fetching Pokémon with ID ${pokemonId}:`, error);
            }
        }

        // If no Pokémon were successfully fetched and displayed
        if (!anySuccessful) {
            pokemonDisplay.innerHTML = "<p>Failed to fetch team Pokémon. Please try again later.</p>";
        }
    }
});