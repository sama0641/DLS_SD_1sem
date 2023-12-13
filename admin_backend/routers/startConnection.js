import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import logger from '../utils/logger.js'
dotenv.config();

// Create connection to mysql database and import where its needed

let pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_AZURE_HOST,
    user: process.env.DB_AZURE_USER,
    password: process.env.DB_AZURE_PASSWORD,
    database: process.env.DB_AZURE_DATABASE,
    port: process.env.DB_AZURE_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testDBConnection() {
    const connection = await pool.getConnection();
    try {
        logger.info("Connected to database");
    }
    catch (err) {
        logger.info("Could not connect to database");
        process.exit(1);
    }
}

testDBConnection();

export default pool;