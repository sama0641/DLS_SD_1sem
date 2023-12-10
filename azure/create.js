import mysql from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();

// This is currently working as a db initializer. 
// We can figure out if this should be used as a db initializer or not later on

// Simply run this file with node create.js to initialize the db

let config =
{
    host: process.env.DB_AZURE_HOST,
    user: process.env.DB_AZURE_USER,
    password: process.env.DB_AZURE_PASSWORD,
    database: process.env.DB_AZURE_DATABASE,
    port: process.env.DB_AZURE_PORT,
    ssl: {
        rejectUnauthorized: false
    }
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else {
        console.log("Connection established.");
        createTable();
    }
});

function createTable(){
    let affectedRowsCount = 0;
    //Creates a table in db called customers if not exists
    conn.query('DROP TABLE IF EXISTS customers;', function (err, results, fields) { 
        if (err) throw err; 
        console.log('Dropped customers table if existed.');
    });
    conn.query('CREATE TABLE customers (id serial PRIMARY KEY, first_name VARCHAR(25), last_name VARCHAR(25), age INT, email VARCHAR(40));', function (err, results, fields) {
        if (err) throw err;
        console.log('Created customers table.');
    });
    //This is simply a insert of a simple test user for creation, so that it is never empty
    conn.query('INSERT INTO customers (first_name, last_name, age, email) VALUES (?, ?, ?, ?);', ['testFirstName1', 'testLastName1', 20, 'test1@mail.dk'], function (err, results, fields) {
        if (err) throw err;
    });
    conn.query('INSERT INTO customers (first_name, last_name, age, email) VALUES (?, ?, ?, ?);', ['testFirstName2', 'testLastName2', 20, 'test2@mail.dk'], function (err, results, fields) {
        if (err) throw err;
    });
    conn.query('INSERT INTO customers (first_name, last_name, age, email) VALUES (?, ?, ?, ?);', ['testFirstName3', 'testLastName3', 20, 'test3@mail.dk'], function (err, results, fields) {
        if (err) throw err;
    });
    conn.end(function (err) { 
    if (err) throw err;
    else console.log(`DB initialization done!, inserted 3 rows.\nClosing connection.`); 
    });
};

function readData(){
    conn.query('SELECT * FROM customers', function (err, results, fields) {
        if (err) throw err;
        else console.log('Selected ' + results.length + ' row(s).');
        for (i = 0; i < results.length; i++) {
            console.log('Row: ' + JSON.stringify(results[i]));
        }
        console.log('Done.');
    });
    conn.end(function (err) { 
        if (err) throw err;
        else  console.log('Closing connection.') 
    });
};

function updateData(){ // To be done when we have a working update button or something
    conn.query('UPDATE customers SET xxx', ["XXX"], function (err, results, fields) {
        if (err) throw err;
        else console.log('Updated ' + results.affectedRows + ' row(s).');
    });
    conn.end(function (err) { 
        if (err) throw err;
        else  console.log('Done.') 
    });
};
// Should probally never be used, but just in case NOT IN WORKING ORDER
function deleteData(){
    conn.query('DELETE FROM customers WHERE id = ?', ['1'], function (err, results, fields) {
        if (err) throw err;
        else console.log('Deleted ' + results.affectedRows + ' row(s).');
    });
    conn.end(function (err) { 
        if (err) throw err;
        else  console.log('Done.') 
    });
};
