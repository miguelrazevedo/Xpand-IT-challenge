import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed', err);
    } else {
        console.log('Connected to Database');
    }
});

export { db };
