import express from "express";
import conn from "./startConnection.js";

const router = express.Router();
router.use(express.json());

// GET ALL TRANSACTIONS FOR A SPECIFIC ACCOUNT

// CREATE A NEW TRANSACTION TODO: SØRG FOR AT ERRORS INDE I transaction bliver exit hvis fejl
router.post("/transaction", async (req, res) => {
    conn.getConnection(async (err, connection) => {
        if (err) {connection.release(); throw err;}
        try{
        connection.beginTransaction(function(err) {
            const create_sender = 'INSERT INTO transactions_data (transaction_id, sender_account_id, reciever_account_id,amount) VALUES (?,?,?,?)';    
            // CREATE TRANSACTION FOR SENDER
            connection.query('INSERT INTO transactions () VALUES ()',  (err, result) => {
                if (err) {connection.release(); throw err;}
                const transaction_sender_id = result.insertId;
                
                console.log("trans id", transaction_sender_id)
                connection.query(create_sender, [transaction_sender_id, req.body.sender_account_id, req.body.reciever_account_id, req.body.amount], (err, result) => {
                    if (err) {connection.release(); throw err;}
                    console.log('Created Sender Transaction');
                });
            });
            // CREATE TRANSACTION FOR reciever
            connection.query('INSERT INTO transactions () VALUES ()',  (err, result) => {
                if (err) {connection.release(); throw err;}
                const transaction_reciever_id = result.insertId;
                connection.query(create_sender, [transaction_reciever_id, req.body.reciever_account_id, req.body.sender_account_id, -(req.body.amount)], (err, result) => {
                    if (err) {connection.release(); throw err;}
                    console.log('Created reciever Transaction');
                });
            });
        // COMMIT CHANGES
        console.log("beginning commit")
        connection.commit()
        });
        } catch(error) {
            connection.rollback()
            throw error;
        }finally{
            res.status(200).send("transaction created");
            connection.release();
    }
    });
});




/**
 * Når man laver en transaction for en customer, bør følgende ske:
 * 1. 2 transactions laves, en for customer_sender og en for customer_reciever
 *  1.1. Dette skal gøres med transaction eller andet således at hvis den ene fejler, fejler den anden også
 * 2. Hvis customer_sender ikke har nok penge på sin konto, skal transactionen ikke gennemføres, dette bør tjekkes før ovenstående bliver igangsat.
 *  2.1. Her skal der tænkes over hvorvidt vi faktisk skal tilføje balance til account objekter eller hvordan vi vil gøre dette 
*/

// GET ALL TRANSACTIONS
router.get("/transactions", async (req, res) => {
    conn.getConnection((err, connection) => {
        if (err) {connection.release(); throw err;}
        connection.query(`SELECT * FROM transactions t JOIN transactions_data td ON t.id = td.transaction_id`, function (err, results) {
            if (err) {connection.release(); throw err;}
            else console.log('Selected ' + results.length + ' row(s).');
            res.status(200).send(results);
            connection.release();
            console.log('--- Selecting all active transactions done! ---');
        });
    });
});

// UPDATE A TRANSACTION

// DELETE A TRANSACTION


export default router;