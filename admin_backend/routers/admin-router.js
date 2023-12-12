import express from "express";
import bcrypt from "bcrypt";
import conn from "./startConnection.js";
import logger from "../utils/logger.js";
import { authenticateToken } from "./auth-router.js";

const router = express.Router();
router.use(express.json());

// Default route
router.get("/", (req, res) => {
    res.send("Welcome to admin frontpage!");
});


// Get all admins
router.get("/admins", authenticateToken, async (req, res) => {
    try {
        const result = await getAdmins();
        if (result.length == 0) {
            res.status(404).send("No admins found");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function getAdmins() {
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=false;')
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
    }
}
// Get a single admin by id
router.get("/admins/:id", authenticateToken, async (req, res) => {
    try {
        const result = await getAdminById(req.params.id);
        if (result.length == 0) {
            res.status(404).send("No admin found");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function getAdminById(id) {
    logger.verbose("got this id: ", id);
    const connection = await conn.getConnection();
    try {
        const [row] = await connection.query('SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=false AND a.id=?;', [id])
        logger.verbose("got this id admin: ", row[0])
        connection.release();
        return row[0];
    } catch (err) {
        logger.verbose(err);
        connection.release();
    }
}

// Get all deleted admins
router.get("/admins_deleted", authenticateToken, async (req, res) => {
    try {
        const result = await getDeletedAdmins();
        if (result.length == 0) {
            res.status(404).send("No deleted admins found");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function getDeletedAdmins() {
    const connection = await conn.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=true;')
        connection.release();
        return rows;
    } catch (err) {
        logger.error(err);
        connection.release();
    }
}

// Create an new admin
router.post("/admin", authenticateToken, async (req, res) => {
    try {
        const result = await createAdmin();
        res.status(200).send("admin created: ", result);
    } catch (err) {
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function createAdmin(values) {
    values.pass = await bcrypt.hash(values.pass, 10);
    const connection = await conn.getConnection();
    try {
        await connection.query('INSERT INTO admins () VALUES ();');
        const [inRow] = await connection.query('SELECT LAST_INSERT_ID();');
        const lastInsertedId = inRow[0]['LAST_INSERT_ID()'];

        const results = await connection.query('INSERT INTO admins_data (admin_id, username, email, pass) VALUES (?,?,?,?);',
            [lastInsertedId, values.username, values.email, values.pass]);

        logger.verbose('--- admin has been added! ---\n ', results);
        connection.release();
        return results;
    } catch (err) {
        logger.error(err);
        connection.release();
    }
}

// Update an admin
router.post("/update_admin", authenticateToken, async (req, res) => {
    try {
        const result = await updateAdmin();
        res.status(200).send("admin updated: ", result);
    } catch (err) {
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function updateAdmin(values) {
    values.pass = await bcrypt.hash(values.pass, 10);
    const connection = await conn.getConnection();
    try {
        const results = await connection.query('INSERT INTO admins_data (admin_id, username, email, pass) VALUES (?,?,?,?);',
            [values.admin_id, values.username, values.email, values.pass]);

        logger.verbose('--- admin has been updated! ---\n ', results);
        connection.release();
    } catch (err) {
        logger.error(err);
        connection.release();
    }
}
// Delete an admin
router.post("/delete_admin", authenticateToken, async (req, res) => {
    try {
        const result = await deleteAdmin();
        res.status(200).send("admin deleted: ", result);
    } catch (err) {
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function deleteAdmin(id) {
    const connection = await conn.getConnection();
    try {
        const results = await connection.query('UPDATE admins SET deleted=true, deleted_at=current_timestamp() WHERE id=?;', [id]);
        logger.verbose('--- admin has been deleted! ---\n ', results);
        connection.release();
    } catch (err) {
        connection.release();
        logger.error(err);
    }
}

export default router;