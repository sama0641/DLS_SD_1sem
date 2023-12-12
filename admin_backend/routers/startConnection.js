import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import logger from '../utils/logger.js'
dotenv.config();

// Create connection to mysql database and import where its needed

let pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST_ADMIN,
    user: process.env.DB_USER_ADMIN,
    password: process.env.DB_PASSWORD_ADMIN,
    database: process.env.DB_NAME_ADMIN,
    port: process.env.DB_PORT_ADMIN,
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