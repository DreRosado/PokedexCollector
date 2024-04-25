import { Database } from 'sqlite-async';

async function setupDB() {
    const db = await Database.open('./pokemonDB.sqlite');
    
    // Create the nodes table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pokemon_namd TEXT,
            about TEXT,
            parent_id INTEGER DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(parent_id) REFERENCES nodes(id)
        );
    `);

    console.log('Database setup complete.');
    await db.close();
}

setupDB().catch(error => {
    console.error('Failed to setup the database:', error.message);
});
