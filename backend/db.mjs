// db.mjs
import { Database } from 'sqlite-async';

async function connect() {
    const db = await Database.open('./db.sqlite');
    console.log('Database connection successfully established');
    return db;
}

export { connect };
