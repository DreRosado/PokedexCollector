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

    for (let position = 1; position <= 6; position++) {
        const pokemonId = team[`pok${position}`];

        if (pokemonId) {
            fetch(`/pokemon/${pokemonId}`)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch Pokémon with ID ${pokemonId}`);
                    return response.json();
                })
                .then(pokemon => {
                    const pokemonCard = createPokemonCard(pokemon, position);
                    pokemonDisplay.appendChild(pokemonCard);
                })
                .catch(error => {
                    console.error(`Error fetching Pokémon with ID ${pokemonId}:`, error);
                    pokemonDisplay.appendChild(createEmptyCard(position, "Failed to load"));
                });
        } else {
            pokemonDisplay.appendChild(createEmptyCard(position, "Empty Slot"));
        }
    }
}

function createPokemonCard(pokemon, position) {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Slot Position ${position}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Types: ${pokemon.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ')}</p>
        <p>Stats: ${pokemon.stats.map(s => s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1) + ': ' + s.base_stat).join(', ')}</p>
        <p>Top Moves: ${pokemon.moves.map(m => m.move.name.charAt(0).toUpperCase() + m.move.name.slice(1)).slice(0, 5).join(', ')}</p>
    `;
    return pokemonCard;
}

function createEmptyCard(position, message) {
    const emptyCard = document.createElement("div");
    emptyCard.classList.add("pokemon-card", "empty");
    emptyCard.innerHTML = `<p>${message} - Position ${position}</p>`;
    return emptyCard;
}
});

document.addEventListener('DOMContentLoaded', () => {
    const removeButton = document.getElementById('removePokemonButton');
    console.log('Button found:', removeButton); // This should log the button element

    removeButton.addEventListener('click', () => {
        console.log('Button clicked'); // Check if this gets logged when clicking the button
        showRemovePopup();
    });
});

function showRemovePopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div style="background-color: rgba(0, 0, 0, 0.8); padding: 20px; border-radius: 5px; text-align: center; color: white;">
            <h2>Remove Pokémon</h2>
            <p>Enter the position (1-6) of the Pokémon to remove:</p>
            <input type="number" id="pokemonPositionInput" min="1" max="6" placeholder="Enter position 1-6">
            <button id="confirmRemoveButton">Confirm Removal</button>
            <button onclick="this.parentNode.parentNode.removeChild(this.parentNode)">Cancel</button>
        </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1000';
    document.body.appendChild(popup);

    document.getElementById('confirmRemoveButton').addEventListener('click', () => removePokemon());
}

function removePokemon() {
    const positionInput = document.getElementById('pokemonPositionInput');
    if (!positionInput || !positionInput.value) {
        alert("Please enter a valid position (1-6).");
        return;
    }

    const position = positionInput.value.trim();
    if (position < 1 || position > 6) {
        alert("Position must be between 1 and 6.");
        return;
    }

    fetch(`/remove-pokemon/${position}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Pokémon removed successfully.");
            // Reload the page or update the UI as necessary
        } else {
            response.text().then(text => alert(text));  // Display the server's response message
        }
    })
    .catch(error => {
        console.error('Error removing Pokémon:', error);
        alert("Error removing Pokémon.");
    });    
}
