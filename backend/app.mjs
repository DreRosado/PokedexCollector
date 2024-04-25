// app.mjs
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { Database } from 'sqlite-async';

const app = express();
const port = 3000;

// Middleware setup
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
        password TEXT
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
        return res.status(400).send("Username and password are required");
    }

    try {
        // Retrieve the user from the database
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (user) {
            // Compare the entered password with the stored hashed password
            const passwordMatches = bcrypt.compareSync(password, user.password);

            if (passwordMatches) {
                req.session.user = { id: user.id, username: user.username }; // Store user info in session
                return res.redirect('/profile');
            } else {
                return res.status(401).send('Invalid username or password');
            }
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error("Sign-in error:", error); // Log error for debugging
        return res.status(500).send("Internal server error");
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


app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile('pokedex.html', { root: 'public' }); // Serve the profile HTML file
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
    const idOrName = req.params.idOrName;
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
