import express from "express";
import conn from "./startConnection.js";
import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { authenticateToken } from "./auth-router.js";
import logger from '../utils/logger.js';

dotenv.config({ path: "./.env" });
const router = express.Router();
router.use(express.json());

// Default route
router.get("/", (req, res) => {
    res.send("Welcome to customer frontpage!");
})

// Get all customers with customer_data joined
router.get("/customers", authenticateToken, async (req, res) => {
    try{
        const result = await getCustomers();
        logger.verbose("the result recieved from getCustomers function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error");
    }
});

export async function getCustomers() {
    const connection = await conn.getConnection();
    try {
        let [rows] = await connection.query('SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=false;');
        connection.release();
        rows = JSON.parse(JSON.stringify(rows));
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// Get a single customer by id with customer_data joined

router.get("/customers/:id", authenticateToken, async (req, res) => { 
    try{
        const result = await getSingleCustomer(req.params.id || req.body.id);
        logger.verbose("the result recieved from getSingleCustomer function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

export async function getSingleCustomer(id) {
    // Ensure that the id is getting handled correctly when comming from rabbitmq
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=false AND c.id=?;', [id]);
        if (rows == []) {
            logger.verbose('No user with id: ' + id + ' found!');
        } else {
            logger.verbose('User with id: ' + id + ' selected!\n ', rows);
        }
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// Show all deleted users
router.get("/customers_deleted", authenticateToken, async (req, res) => {
    try{
        const result = await getDeletedCustomers();
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or no deleted users");
    }
});

export async function getDeletedCustomers() {
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=true;');
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// create customer and customer_data related to that customer
router.post("/customer", authenticateToken, async (req, res) => {
    try{
        const result = await createCustomer(req.body);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error");
    }
});

export async function createCustomer(values) {
    values.password = await bcrypt.hash(values.password, 10);
    const connection = await conn.getConnection();
    try {
        await connection.query('INSERT INTO customers () VALUES ();');
        let [rowsC] = await connection.query('SELECT LAST_INSERT_ID();');
        let lastInsertedId = rowsC[0]['LAST_INSERT_ID()'];

        await connection.query('INSERT INTO customers_data (customer_id, first_name, last_name, age, email, pass) VALUES (?,?,?,?,?,?);', [lastInsertedId, values.firstname, values.lastname, values.age, values.email, values.password]);
        // --------------  THIS PART CREATES AN ACCOUNT FOR THE NEWLY CREATED CUSTOMER ----------------

        await connection.query('INSERT INTO accounts () VALUES ();');
        let [rowsA] = await connection.query('SELECT LAST_INSERT_ID();');
        let lastInsertedIdAccount = rowsA[0]['LAST_INSERT_ID()'];

        await connection.query('INSERT INTO accounts_data (account_id, customer_id) VALUES (?,?);', [lastInsertedIdAccount, lastInsertedId]);
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
    connection.release();
    // send email to customer 
    // await azureMailFunction(values.email, values.firstname);
    return "customer added";
}

// UPDATE CUSTOMER
router.post("/update_customer", authenticateToken, async (req, res) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const result = await updateCustomer(req.body);
        res.status(200).json(result);
    }
    catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

export async function updateCustomer(value) {
    const connection = await conn.getConnection();
    try {
        const update_customers_data = 'INSERT INTO customers_data (customer_id, first_name, last_name, age, email, pass) VALUES (?,?,?,?,?,?);';
        const [rows] = await connection.query(update_customers_data,
            [value.id, value.firstname, value.lastname, value.age, value.email, value.password]);
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// delete a customer by setting deleted to true
router.post("/delete_customer", authenticateToken, async (req, res) => {
    try{
        const result = await deleteCustomer(req.body);
        res.status(200).json(result);
    }
    catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

export async function deleteCustomer(id) {
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('UPDATE customers SET deleted=true, deleted_at=current_timestamp() WHERE id=?;', [id]);
        connection.release();
        logger.info("--- Customer has been deleted ---");
        return rows;
    }
    catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// Nodemail service
// async function azureMailFunction(email, firstname) {
//     try {
//         const url = process.env.FUNCTION_AZURE_URL;
//         const requestBody = { subscriber_email: email, subscriber_name: firstname };

//         const response = await axios.post(url, requestBody);
//         logger.verbose('Response:', response.data);
//     } catch (error) {
//         logger.error('Error with azureMailFunction:', error.response.data);
//     }
// };

export default router;
