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
    const navLinks = document.querySelectorAll('nav a');
    const currentUrl = window.location.pathname; // Get the current URL path
    fetchPokeballSprite(); // Fetch and set the Pokéball sprite

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('active-link'); // Add 'active-link' class to the matching link
        }
        link.addEventListener('click', function () {
            sidebar.classList.remove('visible'); // Hide the sidebar
            // Optionally, reset padding if you have padding adjustments
            const contentElements = document.querySelectorAll("main, header, footer");
            contentElements.forEach(element => {
                element.style.paddingLeft = "0"; // Reset padding
            });
        });
    });

    const currentTime = new Date();
    const nextGameTime = new Date(currentTime.getTime() + 0 * 60000); // Set next game time for 0.25 minutes later

    function startGame() {
        fetch('https://pokeapi.co/api/v2/pokemon/' + Math.floor(Math.random() * 898 + 1)) // Random Pokémon ID
            .then(response => response.json())
            .then(pokemon => {
                const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                document.getElementById('pokemonSprite').src = pokemon.sprites.front_default;
                document.getElementById('pokemonSprite').style.display = 'block';
                document.getElementById('gameMessage').innerHTML = `A wild ${pokemonName} appeared! Find ${pokemonName} to catch it.`;
                document.getElementById('pokeballsContainer').style.display = 'flex';
                setupPokeballs(pokemonName, pokemon.id);
            });
    }

    function fetchPokeballSprite() {
        fetch('https://pokeapi.co/api/v2/item/poke-ball')
            .then(response => response.json())
            .then(data => {
                const pokeballSpriteUrl = data.sprites.default;
                document.querySelectorAll('.pokeball').forEach(pokeball => {
                    pokeball.src = pokeballSpriteUrl;
                });
            })
            .catch(error => console.error('Failed to fetch Pokéball sprite:', error));
    }

    function setupPokeballs(pokemonName, pokemonId) {
        const correctPokeball = Math.floor(Math.random() * 3); // Randomly select a winning pokeball
        const trashPic = Math.floor(Math.random() * 2); // Randomly select whether incorrect choice is trash or soggy boots
        let message, picPath;

        if (trashPic === 0) {
            message = "You've caught trash. Better luck next time.";
            picPath = "trash_bag.png"
        }
        else {
            message = "You've caught soggy boots. Better luck next time.";
            picPath = "soggy_boots.gif"
        }

        document.querySelectorAll('.pokeball').forEach((pokeball, index) => {
            pokeball.onclick = function () {
                // Disable the onclick handlers for all pokeballs after one is clicked
                document.querySelectorAll('.pokeball').forEach((otherPokeball) => {
                    otherPokeball.onclick = null;  // Set onclick to null to disable further clicks
                });
        
                if (index === correctPokeball) {
                    document.getElementById('gameMessage').innerHTML = `You've caught ${pokemonName}!`;
                    showAddToTeamOptions(pokemonId, pokemonName);
                    document.getElementById('pokemonSprite').src = pokemon.sprites.front_default;
                } else {
                    document.getElementById('gameMessage').innerHTML = message;
                    document.getElementById('pokemonSprite').src = picPath;
                }
        
                // Apply grayscale filter to all Pokéballs to visually indicate they are disabled
                document.querySelectorAll('.pokeball').forEach((otherPokeball) => {
                    otherPokeball.classList.add('grayscale');
                });
            };
        });
    }

    function showAddToTeamOptions(pokemonId, pokemonName) {
        const container = document.createElement('div');
        container.id = 'teamOptions';  // Give an ID for easier CSS targeting

        const addButton = document.createElement('button');
        addButton.id = 'addButton';
        addButton.innerText = 'Add to Team';
        addButton.onclick = () => addToTeam(pokemonId, pokemonName);

        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancelButton';
        cancelButton.innerText = 'Cancel';
        cancelButton.onclick = () => location.reload(); // Reset the game

        container.appendChild(addButton);
        container.appendChild(cancelButton);

        // Ensure the container is being added to the main element or a specific part of the page.
        document.querySelector('main').appendChild(container); // Make sure this selector is correct
    }

    function addToTeam(pokemonId, pokemonName) {
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
    }
    startGame();
});
