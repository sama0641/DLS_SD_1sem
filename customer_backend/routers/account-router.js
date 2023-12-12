import express from "express";
import conn from "./startConnection.js";
import logger from '../utils/logger.js';
import { authenticateToken } from "./auth-router.js";


const router = express.Router();
router.use(express.json());

// GET ALL ACCOUNTS

router.get("/accounts", authenticateToken, async (req, res) => {
    try{

        const result = await getAccounts();
        logger.verbose("the result recieved from getAccounts function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or no accounts found");
    }
});

async function getAccounts() {
    try {
        const connection = await conn.getConnection();
        let [rows] = await connection.query('SELECT * FROM accounts a JOIN accounts_data ad ON a.id = ad.account_id;');
        connection.release();
        return rows;
    }
    catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}
// GET ALL ACCOUNTS FOR A CUSTOMER

router.get("/accounts/:customer_id", authenticateToken, async (req, res) => { 
    try{
        const result = await getAccountsForCustomer(req.params.customer_id || req.body.customer_id);
        logger.verbose("the result recieved from getAccountsForCustomer function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function getAccountsForCustomer(id) {
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM accounts a JOIN accounts_data ad ON a.id = ad.account_id WHERE a.deleted=false AND ad.customer_id=?;', [id]);
        console.log('Account with id: ' + id + ' selected!\n ', rows);
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

//GET A SPECIFIK ACCOUNT FOR A CUSTOMER BY ACCOUNT ID
router.post("/account_id", authenticateToken, async (req, res) => {
    try{
        const result = await getSingleAccount(req.body);
        logger.verbose("the result recieved from getSingleAccount function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function getSingleAccount(values) {
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM accounts a JOIN accounts_data ad on a.id = ad.account_id AND a.deleted=false AND a.id=? AND ad.customer_id=?;', [values.account_id, values.customer_id]);
        logger.verbose('Account with id: ' + values.account_id + ' for customer with id: ', values.customer_id, 'selected!\n ', rows);
        connection.release();
        return rows;
    }
    catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// CREATE A NEW ACCOUNT FOR A CUSTOMER
router.post("/account", authenticateToken, async (req, res) => {
    try{
        const result = await createAccount(req.body.customer_id);
        logger.verbose("the result recieved from createAccount function", result);
        res.status(200).json("-- Account has been created --");
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function createAccount(id) {
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('INSERT INTO accounts () VALUES ();');
        let [rowsA] = await connection.query('SELECT LAST_INSERT_ID();');
        let lastInsertedId = rowsA[0]['LAST_INSERT_ID()'];

        await connection.query('INSERT INTO accounts_data (account_id, customer_id) VALUES (?,?);', [lastInsertedId, id]);
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}
// UPDATE AN ACCOUNT FOR A CUSTOMER
// not sure if this should even be allowed to be changed/updated
router.post("/update_account", authenticateToken, async (req, res) => {
    try{
        const result = await updateAccount(req.body);
        logger.verbose("the result recieved from updateAccount function", result);
        res.status(200).json("-- Account has been updated --");
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function updateAccount(values) {
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('INSERT INTO accounts_data (account_id, customer_id) VALUES (?,?);', [values.id, values.customer_id]);
        logger.verbose('Account with id: ' + values.id + ' for customer with id: ', values.customer_id, 'selected!\n ', rows);
        connection.release();
        return rows;
    }
    catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// DELETE AN ACCOUNT FOR A CUSTOMER
// again not sure if an account should be allowed to be deleted
router.post("/delete_account", authenticateToken, async (req, res) => {
    try{
        const result = await deleteAccount(req.body);
        logger.verbose("the result recieved from deleteAccount function", result);
        res.status(200).json("-- Account has been deleted --");
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function deleteAccount(id) {
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('UPDATE accounts SET deleted=true, deleted_at=current_timestamp() WHERE id=?;', [id]);
        logger.verbose('Account with id: ' + id + ' deleted!\n ', rows);
        connection.release();
        return rows;
    }
    catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

// SHOW BALANCE FOR AN ACCOUNT
router.get("/balance/:account_id", authenticateToken, async (req, res) => {
    try{
        const result = await getBalance(req.params.account_id || req.body.account_id);
        logger.verbose("the result recieved from getBalance function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function getBalance(id) {
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT SUM(amount) AS balance FROM transactions_data WHERE sender_account_id=? or reciever_account_id=?;', [id, id]);
        logger.verbose('Balance for account with id: ' + id + ' selected!\n ', rows);
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

router.get("/allBalance/:customer_id", authenticateToken, async (req, res) => {
    try{
        const result = await getBalanceByCustomer(req.params.customer_id || req.body.customer_id);
        logger.verbose("the result recieved from getBalanceByCustomer function", result);
        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json("Internal server error, or non existing user");
    }
});

async function getBalanceByCustomer(id) {
    if (typeof id === "object") {
        id = id.id;
    }
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT a.account_id, a.title, SUM(t.amount) AS balance FROM accounts_data AS a JOIN transactions_data AS t ON a.account_id = t.sender_account_id JOIN customers_data AS c ON a.customer_id = c.customer_id WHERE c.customer_id = ? GROUP BY a.account_id, a.title;', [id]);
        logger.verbose('Balance for customer with id: ' + id + ' selected!\n ', rows);
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
        throw err;
    }
}

export default router;