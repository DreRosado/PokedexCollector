import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { Database } from 'sqlite-async';

const app = express();
const port = 3000;

// Middleware setup
app.use(express.json()); // For JSON parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Session configuration
app.use(
    session({
        secret: 'yourSecretKey', // Change to a secure, random key
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 600000, httpOnly: true }, // Session cookie settings
    })
);

export let db = await Database.open('db.sqlite');
await db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        pok1 INTEGER,
        pok2 INTEGER, 
        pok3 INTEGER, 
        pok4 INTEGER, 
        pok5 INTEGER, 
        pok6 INTEGER
    )
`);

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next step
    } else {
        res.status(401).send('Unauthorized: Please sign in to access this resource'); // User is not authenticated
    }
}

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome</h1>
        <p><a href="/signin">Sign In</a></p>
        <p><a href="/signup">Sign Up</a></p>
    `);
});

// Sign-in form
app.get('/signin', (req, res) => {
    res.sendFile('signin.html', { root: 'public' });
});

app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: 'public' });
});

// Handle sign-in form submission
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (user) {
            const passwordMatches = bcrypt.compareSync(password, user.password);

            if (passwordMatches) {
                req.session.user = { id: user.id, username: user.username };
                return res.json({ success: true, message: 'Login successful' });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Sign-in error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(password);

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).redirect('/signin');
    } catch (error) {
        console.error('Sign-up error:', error); // Log the error for debugging
        res.status(500).send('Internal server error');
    }
});

app.get('/pokedex', isAuthenticated, (req, res) => {
    res.sendFile('pokedex.html', { root: 'public' }); // Serve the Pokédex HTML file
});

app.get('/dailycatch', isAuthenticated, (req, res) => {
    res.sendFile('dailycatch.html', { root: 'public' }); // Serve the Daily Catch HTML file
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile('profile.html', { root: 'public' }); // Serve the Profile HTML file
});

app.get('/settings', isAuthenticated, (req, res) => {
    res.sendFile('settings.html', { root: 'public' }); // Serve the Settings HTML file
});

app.get('/pokemon-view', isAuthenticated, (req, res) => {
    res.sendFile('pokemon.html', { root: 'public' }); // Serve the Pokémon HTML file
});

app.get('/pokemon-view/:idOrName', isAuthenticated, (req, res) => {
    res.sendFile('pokemon.html', { root: 'public' }); // Serve the Pokémon HTML file
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/signin'); // Redirect to sign-in page after logout
        }
    });
});

app.post('/add-pokemon', isAuthenticated, async (req, res) => {
    const { position, newPokemon } = req.body; // Get the desired position and new Pokémon from the request body
    const userId = req.session.user.id; // Get the user ID from the session

    if (position < 1 || position > 6) {
        return res.status(400).send('Position must be between 1 and 6'); // Ensure the position is valid
    }

    try {
        // Update the specified position with the new Pokémon ID, replacing any existing one
        await db.run(`UPDATE users SET pok${position} = ? WHERE id = ?`, [newPokemon, userId]);

        res.status(200).send(`Pokémon in position ${position} has been replaced with ${newPokemon}`); // Success response
    } catch (error) {
        console.error('Error adding Pokémon:', error); // Log the error for debugging
        res.status(500).send('Internal server error');
    }
});

app.get('/pokemon', isAuthenticated, (req, res) => {
    const limit = req.query.limit || 151; // Default to 151 Pokémon
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            res.json(data); // Return the fetched Pokémon data as JSON
        })
        .catch((error) => {
            console.error('Error fetching Pokémon:', error); // Log error for debugging
            res.status(500).send('Internal server error'); // Handle fetch errors
        });
});

app.get('/pokemon/:idOrName', isAuthenticated, async (req, res) => {
    const idOrName = req.params.idOrName.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;

    try {
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            res.json(data); // Return the fetched Pokémon data as JSON
        } else {
            res.status(404).send(`Pokémon with ID or Name '${idOrName}' not found.`);
        }
    } catch (error) {
        console.error(`Error fetching Pokémon with ID or Name '${idOrName}':`, error); // Log the error for debugging
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

