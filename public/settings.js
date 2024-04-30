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

document.getElementById('updateForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/update-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert('Update successful!');
    } else {
        alert(`Failed to update: ${result.message}`);
    }
});

window.onload = async () => {
    const response = await fetch('/get-settings');
    const data = await response.json();

    if (response.ok) {
        document.getElementById('username').value = data.username;
        document.getElementById('password').placeholder = 'Enter new password';
    } else {
        console.error(data.message);
    }
};
