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
    fetchPokeballSprite(); // Fetch and set the Pokéball sprite

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

    const currentTime = new Date();
    const nextGameTime = new Date(currentTime.getTime() + 0*60000); // Set next game time for 0.25 minutes later

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
            pokeball.onclick = function() {
                document.querySelectorAll('.pokeball').forEach((otherPokeball, otherIndex) => {
                    if (otherIndex !== index) {
                        otherPokeball.classList.add('grayscale'); // Apply grayscale filter to other Pokéballs
                    }
                });

                if (index === correctPokeball) {
                    document.getElementById('gameMessage').innerHTML = `You've caught ${pokemonName}!`;
                    showAddToTeamOptions(pokemonId, pokemonName);
                    document.getElementById('pokemonSprite').src = pokemon.sprites.front_default;
                } else {
                    document.getElementById('gameMessage').innerHTML = message;
                    document.getElementById('pokemonSprite').src = picPath;
                }
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
        fetch('/my-team').then(res => res.json()).then(team => {
            const emptySlot = Object.keys(team).find(key => !team[key]);
            if (emptySlot) {
                fetch(`/add-pokemon/${emptySlot}/${pokemonName}`, { method: 'POST' }).then(() => {
                    alert(`${pokemonName} added to your team!`);
                    location.reload();
                });
            } else {
                showFullTeamOptions(pokemonId, pokemonName); // Handle full team scenario
            }
        });
    }
    
    function showFullTeamOptions(pokemonId, pokemonName) {
        const popup = document.createElement('div');
        popup.innerHTML = `
            <p>Your team is full. Enter the position (1-6) where you want to place ${pokemonName}:</p>
            <input type="number" id="teamPosition" min="1" max="6">
            <button onclick="replacePokemon(${pokemonId}, document.getElementById('teamPosition').value, '${pokemonName}')">Replace</button>
            <button onclick="this.parentNode.remove()">Cancel</button>
        `;
        document.body.appendChild(popup);
    }
    
    function replacePokemon(pokemonId, position, pokemonName) {
        if (position < 1 || position > 6) {
            alert('Invalid position.');
            return;
        }
        fetch(`/replace-pokemon/${position}/${pokemonId}`, { method: 'POST' }).then(() => {
            alert(`Pokémon replaced with ${pokemonName} in position ${position}.`);
            location.reload();
        });
    }    

    function showTimer() {
        const interval = setInterval(function() {
            const now = new Date();
            const distance = nextGameTime - now;
            if (distance < 0) {
                clearInterval(interval);
                startGame();
                return;
            }
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById('timer').innerHTML = `${hours} hours ${minutes} minutes ${seconds} seconds`;
        }, 1000);
    }

    if (currentTime < nextGameTime) {
        showTimer();
    } else {
        startGame();
    }
});
