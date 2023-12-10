import express from "express";
import conn from "./startConnection.js";

const router = express.Router();
router.use(express.json());

// GET ALL ACCOUNTS
router.get("/accounts", async (req, res) => {
    conn.getConnection(function (err, connection) {
        connection.query('SELECT * FROM accounts a JOIN accounts_data ad ON a.id = ad.account_id;', function (err, results) {
            if (err) {
                connection.release();
                throw err;
            }
            else console.log('Selected ' + results.length + ' row(s).');
            res.status(200).send(results);
            connection.release();
            console.log('--- Selecting all active accounts done! ---');
        });
    });
});

// GET ALL ACCOUNTS FOR A CUSTOMER
router.get("/accounts/:customer_id", async (req, res) => { 
    conn.getConnection(function (err, connection) {
        if(err) throw err;
        console.log(req.params.customer_id)
        const select_all_account = 'SELECT * FROM accounts a JOIN accounts_data ad on a.id = ad.account_id AND a.deleted=false AND ad.customer_id=?;';
        connection.query(select_all_account, [req.params.customer_id], function (err, result) {
            if (err) {
                connection.release();
                throw err;
            }
            if(result.length === 0) {
                res.status(404).send('accounts not found or it/they might be deleted');
                connection.release();
            }else{
                console.log('accounts with customer_id: ' + req.params.id + ' selected!\n ', result)
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});

//GET A SPECIFIK ACCOUNT FOR A CUSTOMER BY ACCOUNT ID
// REQUIRED = account_id, customer_id
router.post("/account_id", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if(err) throw err;
        const select_account = 'SELECT * FROM accounts a JOIN accounts_data ad on a.id = ad.account_id AND a.deleted=false AND a.id=? AND ad.customer_id=?;';
        connection.query(select_account, [req.body.account_id, req.body.customer_id], function (err, result) {
            if (err) {
                connection.release();
                throw err;
            }
            if(result.length === 0) {
                res.status(404).send('account not found or it/they might be deleted');
                connection.release();
            }else{
                console.log('account with account_id: ' + req.body.account_id + ' selected!\n ', result)
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});


// CREATE A NEW ACCOUNT FOR A CUSTOMER
router.post("/account", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if(err) {connection.release(); throw err;}
        const insert_account = 'INSERT INTO accounts () VALUES ();';
        const select_last = 'SELECT LAST_INSERT_ID();';
        const insert_account_data = 'INSERT INTO accounts_data (account_id, customer_id) VALUES (?,?);';
        connection.query(insert_account, function (err, result) {
            if (err) {connection.release(); throw err;}

            connection.query(select_last, function (err, rows) {
                if (err) {connection.release();throw err}
                const lastInsertedId = rows[0]['LAST_INSERT_ID()'];
                console.log('Last inserted ID:', lastInsertedId);

                connection.query(insert_account_data, [lastInsertedId, req.body.customer_id], function (err, result) {
                    if (err) {connection.release();throw err}
                    console.log('--- account created! ---');
                });
            });
        });
        res.status(201).send('account created!');
        connection.release();
    });
});

// UPDATE AN ACCOUNT FOR A CUSTOMER
// not sure if this should even be allowed to be changed/updated
router.post("/update_account", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const update_accounts_data = 'INSERT INTO accounts_data (account_id, customer_id) VALUES (?,?);';
        // Prob just need to use one of the other queries to get the latest account_id and use the values from there
        connection.query(update_accounts_data, 
            [req.body.id,req.body.customer_id], 
            function (err, results, fields) {
                if (err) {connection.release();throw err}
                console.log('--- account has been updated! ---')
            });
        res.status(200).send("account updated")
        connection.release();
    });
});

// DELETE AN ACCOUNT FOR A CUSTOMER
// again not sure if an account should be allowed to be deleted
router.post("/delete_account", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const delete_account = 'UPDATE accounts SET deleted=true, deleted_at=current_timestamp() WHERE id=?;';
        connection.query(delete_account, [req.body.id], function (err, results, fields) {
            if (err) {connection.release();throw err}
            console.log('--- Account has been deleted! ---')
            });
        res.status(200).send("Account deleted")
        connection.release();
    });
});

// SHOW BALANCE FOR AN ACCOUNT
router.get("/balance/:account_id", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const select_balance = 'SELECT SUM(amount) AS balance FROM transactions_data WHERE sender_account_id=? or reciever_account_id=?;';
        connection.query(select_balance, [req.params.account_id, req.params.account_id], function (err, result) {
            if (err) {connection.release();throw err}
            if(result.length === 0) {
                res.status(404).send('account not found or it/they might be deleted');
                connection.release();
            }else{
                console.log('balance for account_id: ' + req.params.account_id + ': ', result);
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});


export default router;