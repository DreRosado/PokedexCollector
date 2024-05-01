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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/get-settings');
        const data = await response.json();

        if (response.ok) {
            // Display username and email in text elements
            document.getElementById('usernameDisplay').textContent = data.username;
            document.getElementById('emailDisplay').textContent = data.email || 'No email set'; // Display 'No email set' if null
            document.getElementById('email').value = data.email || ''; // Set value in the form for updating
        } else {
            console.error('Failed to fetch settings:', data.message);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }

    document.getElementById('updateForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;

        const response = await fetch('/update-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('emailDisplay').textContent = email; // Update display after successful update
            alert('Email updated successfully!');
        } else {
            alert(`Failed to update email: ${result.message}`);
        }
    });
});
