import express from "express";
import conn from "./startConnection.js";
import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: "./.env" });
const router = express.Router();
router.use(express.json());


// Default route
router.get("/", (req, res) => {
    res.send("Welcome to customer frontpage!")
})

// Get all customers with customer_data joined
router.get("/customers", async (req, res) => {
    conn.getConnection(function (err, connection) {
        connection.query('SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=false;', function (err, results) {
            if (err) {
                connection.release();
                throw err;
            }
            else console.log('Selected ' + results.length + ' row(s).');
            res.status(200).send(results);
            connection.release();
            console.log('--- Selecting all active customers done! ---');
        });
    });
});

// Get a single customer by id with customer_data joined
router.get("/customers/:id", async (req, res) => { 
    conn.getConnection(function (err, connection) {
        if(err) throw err;
        const select_single_customer = 'SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=false AND c.id=?;';
        connection.query(select_single_customer, [req.params.id], function (err, result) {
            if (err) {
                connection.release();
                throw err;
            }
            if(result.length === 0) {
                res.status(404).send("Customer not found or it might be deleted");
                connection.release();
            }else{
                console.log('User with id: ' + req.params.id + ' selected!\n ', result)
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});
// Show all deleted users
router.get("/customers_deleted", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if(err) throw err;
        const select_deleted_customers = 'SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=true;';
        connection.query(select_deleted_customers, function (err, result) {
            if (err) {
                connection.release();
                throw err;
            }
            if(result.length === 0) {
                res.status(404).send("No deleted customers found");
                connection.release();
            }else{
                console.log('Deleted customers selected!\n ', result)
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});
// create customer and customer_data related to that customer
// TODO: Eventuelt valider bruger input, såsom at email skal være en email, password skal være en string, osv.
router.post("/customer", async (req, res) => {
    // TODO: encrypt password before db
    await bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) throw err;
        req.body.password = hash;
    });
    
    await conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const insert_customers = 'INSERT INTO customers () VALUES ();';
        const select_last = 'SELECT LAST_INSERT_ID();'
        const insert_customers_data = 'INSERT INTO customers_data (customer_id, first_name, last_name, age, email, pass) VALUES (?,?,?,?,?,?);';

        connection.query(insert_customers, function (err, results) {
            if (err) {connection.release();throw err}

            connection.query(select_last, function (err, rows) {
                if (err) {connection.release();throw err}
                const lastInsertedId = rows[0]['LAST_INSERT_ID()'];
                console.log('Last inserted ID:', lastInsertedId);


                connection.query(insert_customers_data, [lastInsertedId, req.body.firstname, req.body.lastname, req.body.age, req.body.email, req.body.password], function (err, results) {
                    if (err) {connection.release();throw err}
                    console.log('--- customer has been added! ---\n ', results)
                });
// --------------  THIS PART CREATES AN ACCOUNT FOR THE NEWLY CREATED CUSTOMER ----------------

                const insert_account = 'INSERT INTO accounts () VALUES ();';
                const insert_account_data = 'INSERT INTO accounts_data (account_id, customer_id) VALUES (?,?);';
                connection.query(insert_account, function (err, result) {
                    if (err) {connection.release(); throw err;}

                    connection.query(select_last, function (err, rows) {
                        if (err) {connection.release();throw err}
                        const lastInsertedIdAccount = rows[0]['LAST_INSERT_ID()'];
                        console.log('Last inserted ID:', lastInsertedIdAccount);

                        connection.query(insert_account_data, [lastInsertedIdAccount, lastInsertedId], function (err, result) {
                            if (err) {connection.release();throw err}
                            console.log('--- account created! ---');
                        });
                    });
                });
            });
        });
        res.status(200).send("customer added");
        connection.release();
    });
    // send email to customer
    await azureMailFunction(req.body.email, req.body.firstname);
});
// NOT COMPLETELY DONE
// update a customers by creating a new customer_data row as to not overwrite old data and reach snapshot
router.post("/update_customer", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const update_customers_data = 'INSERT INTO customers_data (customer_id, first_name, last_name, age, email, pass) VALUES (?,?,?,?,?,?);';
        // TODO Not quite sure if it should use req.body for the ID or how we are going to work with that
        // maybe look into sending some data as default and only change what is sent if it is changed from frontend
        connection.query(update_customers_data, 
            [req.body.id, req.body.firstname, req.body.lastname, req.body.age, req.body.email, req.body.password], 
            function (err, results, fields) {
                if (err) {connection.release();throw err}
                console.log('--- Customer has been updated! ---')
            });
        res.status(200).send("customer updated")
        connection.release();
    });
});

// delete a customer by setting deleted to true
router.post("/delete_customer", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const delete_customer = 'UPDATE customers SET deleted=true, deleted_at=current_timestamp() WHERE id=?;';
        connection.query(delete_customer, [req.body.id], function (err, results, fields) {
            if (err) {connection.release();throw err}
            console.log('--- Customer has been deleted! ---')
            });
        res.status(200).send("customer deleted")
        connection.release();
    });
});

async function azureMailFunction(email, firstname) {
    try {
        const url = process.env.FUNCTION_AZURE_URL;
        const requestBody = {subscriber_email: email, subscriber_name: firstname};
        
        const response = await axios.post(url, requestBody);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error with azureMailFunction:', error.response.data);
    }
};

export default router;