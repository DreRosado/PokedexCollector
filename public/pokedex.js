document.getElementById("randomizeButton").addEventListener("click", async function () {
    const button = document.getElementById("randomizeButton");
    const pokemonDisplay = document.getElementById("pokemonDisplay");

    button.disabled = true; // Disable the button to prevent multiple clicks
    pokemonDisplay.innerHTML = ""; // Clear previous content

    try {
        const randomIds = generateRandomPokemonIds(12); // Generate an array of 12 random Pokémon IDs
        // Wait for all fetch operations to complete using Promise.all
        await Promise.all(randomIds.map(id => fetchAndDisplayPokemon(id)));
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

// Function to fetch and display Pokémon details by name
async function searchPokemon() {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    if (searchInput) {
        await fetchAndDisplayPokemon(searchInput);
    } else {
        document.getElementById("pokemonDisplay").innerHTML = "<p>Please enter a Pokémon name.</p>";
    }
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

document.getElementById("searchButton").addEventListener("click", async function () {
    const searchInput = document.getElementById("searchInput").value.trim();

    if (searchInput) {
        // await fetchAndDisplayPokemon(searchInput);
        window.location.href = `/pokemon-view/${searchInput}`;  // Navigate to the Pokémon page with the ID or name
    } else {
        document.getElementById("pokemonDisplay").innerHTML = "<p>Please enter a Pokémon name.</p>";
    }
});

document.getElementById('addPokemonButton').addEventListener('click', () => {
    const pokemonName = document.getElementById('searchInput').value; // Get the Pokémon name from the search bar

    if (!pokemonName) {
        alert('Please enter a Pokémon name in the search bar');
        return; // Don't proceed if no Pokémon name is entered
    }

    const popup = document.createElement('div'); // Create a popup div
    popup.innerHTML = `
        <div style="background-color: rgba(0, 0, 0, 0.8); padding: 10px; border-radius: 5px; text-align: center; color: white;">
            <h2>Add Pokémon</h2>
            <p>Pokémon Name: ${pokemonName}</p> <!-- Display the Pokémon name -->
            <label for="position">Position (1-6):</label>
            <input type="number" id="position" min="1" max="6">
            <button id="confirmAdd">Add</button>
            <button id="closePopup">Close</button>
        </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = 1000;
    document.body.appendChild(popup); // Add the popup to the DOM

    // Handle the "Add" button click to send the POST request
    document.getElementById('confirmAdd').addEventListener('click', () => {
        const position = document.getElementById('position').value;

        if (!position || position < 1 || position > 6) {
            alert('Please specify a valid position (1-6)');
            return;
        }

        fetch('/add-pokemon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `position=${position}&newPokemon=${pokemonName}`, // Send the position and Pokémon name
        })
            .then(response => response.text())
            .then(data => {
                document.body.removeChild(popup); // Close the popup
            })
            .catch(error => {
                console.error('Error adding Pokémon:', error);
                alert('Error adding Pokémon');
            });
    });

    // Handle the "Close" button click to close the popup
    document.getElementById('closePopup').addEventListener('click', () => {
        document.body.removeChild(popup); // Close the popup
    });
});

async function fetchAndDisplayPokemon(pokemonIdentifier) {
    const pokemonDisplay = document.getElementById("pokemonDisplay");
    pokemonDisplay.innerHTML = ""; // Clear previous content

    try {
        const response = await fetch(`/pokemon/${pokemonIdentifier}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon with identifier ${pokemonIdentifier}`);
        }
        const pokemon = await response.json();

        const capitalizedPokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const types = pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(", ");
        const stats = pokemon.stats.map(stat => `${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: ${stat.base_stat}`).join(", ");
        const moves = pokemon.moves.map(move => move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)).slice(0, 5).join(", "); // Display first 5 moves

        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-card");
        pokemonCard.innerHTML = `
            <h2>${capitalizedPokemonName}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Types: ${types}</p>
            <p>Stats: ${stats}</p>
            <p>Top Moves: ${moves}</p>
        `;

        pokemonDisplay.appendChild(pokemonCard);

        // Event listener for the select button on the Pokémon card
        pokemonCard.addEventListener('click', () => {
            const searchInput = document.getElementById("searchInput");
            searchInput.value = capitalizedPokemonName; // Set the name in the search input
            // fetchAndDisplayPokemon(searchInput.value); // Trigger the function again to refresh the display
            window.location.href = `/pokemon-view/${searchInput.value}`;  // Navigate to the Pokémon page with the ID or name
        });        
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        pokemonDisplay.innerHTML = "<p>Pokémon not found. Please try again.</p>";
    }
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
    const navLinks = document.querySelectorAll('nav a');
    const currentUrl = window.location.pathname; // Get the current URL path

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('active-link'); // Add 'active-link' class to the matching link
        }
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
