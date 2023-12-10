import mysql from 'mysql2';
import * as dotenv from 'dotenv';
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

pool.getConnection((err,connection)=> {
    if(err)
    throw err;
    console.log('Database connected successfully');
    connection.release();
});



export default pool;