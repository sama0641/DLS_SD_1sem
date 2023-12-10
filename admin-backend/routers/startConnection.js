import mysql from 'mysql2';
import * as dotenv from 'dotenv';
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

pool.getConnection((err,connection)=> {
    if(err)
    throw err;
    console.log('Database connected successfully');
    connection.release();
});



export default pool;