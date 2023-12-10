import express from "express";
import conn from "./startConnection.js";

const router = express.Router();
router.use(express.json());

// Default route
router.get("/", (req, res) =>{
    res.send("Welcome to admin frontpage!");
});


// Get all admins
router.get("/admins", async (req, res) => {
    conn.getConnection(function (err, connection) {
        connection.query('SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=false;', function (err, results) {
            if (err) {
                connection.release();
                throw err;
            }
            else console.log('Selected ' + results.length + ' row(s).');
            res.status(200).send(results);
            connection.release();
            console.log('--- Selecting all active admins done! ---');
            
        });
    });
});

// Get a single admin by idf
router.get("/admins/:id", async (req, res) => { 
    conn.getConnection(function (err, connection) {
        if(err) throw err;
        const select_single_admin = 'SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=false AND a.id=?;';
        connection.query(select_single_admin, [req.params.id], function (err, result) {
            if (err) {
                connection.release();
                throw err;
            }
            if(result.length === 0) {
                res.status(404).send("admin not found or it might be deleted");
                connection.release();
            }else{
                console.log('admin with id: ' + req.params.id + ' selected!\n ', result)
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});

// Get all deleted admins
router.get("/admins_deleted", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if(err) throw err;
        const select_deleted_admins = 'SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=true;';
        connection.query(select_deleted_admins, function (err, result) {
            if (err) {
                connection.release();
                throw err;
            }
            if(result.length == 0) {
                res.status(404).send("No deleted admins found");
                connection.release();
            }else{
                console.log('Deleted admins selected!\n ', result)
                res.status(200).send(result);
                connection.release();
            }
        });
    });
});

// Create an new admin
router.post("/admin", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const insert_admins = 'INSERT INTO admins () VALUES ();';
        const select_last = 'SELECT LAST_INSERT_ID();'
        const insert_admins_data = 'INSERT INTO admins_data (admin_id, username, email, pass) VALUES (?,?,?,?);';

        connection.query(insert_admins, function (err, results) {
            if (err) {connection.release();throw err}
            connection.query(select_last, function (err, rows) {
                if (err) {connection.release();throw err}
                const lastInsertedId = rows[0]['LAST_INSERT_ID()'];
                console.log('Last inserted ID:', lastInsertedId);


                connection.query(insert_admins_data, 
                    [lastInsertedId, req.body.username, req.body.email, req.body.password], function (err, results, fields) {
                        if (err) {connection.release();throw err}
                        console.log('--- admin has been added! ---\n ', results);
                    });
            });
                res.status(200).send("admin added");
                connection.release();
        });
    });
});

// Update an admin
router.post("/update_admin", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const update_admins_data = 'INSERT INTO admins_data (admin_id, username, email, pass) VALUES (?,?,?,?);';
        connection.query(update_admins_data, 
            [req.body.id, req.body.username, req.body.email, req.body.password], 
            function (err, results) {
                if (err) {connection.release();throw err}
                console.log('--- admin has been updated! ---\n ', results);
            });
        res.status(200).send("admin updated")
        connection.release();
    });
});

// Delete an admin
router.post("/delete_admin", async (req, res) => {
    conn.getConnection(function (err, connection) {
        if (err) {connection.release();throw err}
        const delete_admin = 'UPDATE admins SET deleted=true, deleted_at=current_timestamp() WHERE id=?;';
        connection.query(delete_admin, [req.body.id], function (err, result) {
            if (err) {connection.release();throw err}
                console.log('--- admin has been deleted! ---\n ', result);
            });
        res.status(200).send("admin deleted")
        connection.release();
    });
});

export default router;