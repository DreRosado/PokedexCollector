
Project Overview
This project is a web application built using Node.js and Express framework, leveraging various middleware for enhanced functionality. The application features a comprehensive user authentication system, session management, database operations with SQLite, and integrates the Pokémon API for interactive features. The app if for pokemon fans that want to collect their favorite pokemon and learn about them. The user can create a team and catch rare pokemon to win prizes!

Key Features
User Authentication: Users can sign up, sign in, and log out. Passwords are securely hashed using bcrypt.
Session Management: Sessions are handled using express-session, with cookie settings for security and persistence.
Database Operations: SQLite is used for storing user data and related information. Database schemas include tables for users and their associated emails, along with detailed user information such as Pokémon collections.
Dynamic Content: Users can interact with Pokémon data fetched from the external Pokémon API, including viewing Pokémon details and managing their collections.
Middleware Configuration
Body Parser: Used for parsing incoming request bodies.
Cookie Parser: Parses cookies attached to the client request object.
Express Static: Serves static files like HTML, CSS, and JavaScript from the 'public' directory.
Security Features
Sessions are secured with a secret key and configured to handle cookie and session data securely.
Passwords are hashed using bcrypt before storing in the database to ensure security against breaches.
API Integration
Pokémon data is fetched from an external API and includes features like fetching Pokémon by name or ID, and displaying detailed Pokémon data.
Daily interactive features allow users to "catch" Pokémon, which are then added to their personal collection in the database.
User Interaction
Users can interact with the application through various forms and UI elements rendered from the server, including sign-up, sign-in, and managing Pokémon collections.
The application provides feedback and interactive updates based on user actions, such as adding or removing Pokémon from their collection or updating account settings.
Running the Application
The application is set up to run on a local server at port 3000.
Users need to navigate to http://localhost:3000 to access the application and start interacting with the features.

Youtube Link Video: https://youtu.be/A4kBUdfHSTY