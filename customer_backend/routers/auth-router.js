import express from "express";
import bcrypt from "bcrypt";
import conn from "./startConnection.js";
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.use(express.json());

// Login router
router.post("/auth/login", async (req, res) => {
    console.log("Login request received");
    if (!req.body.email || !req.body.password) {
        res.status(400).send("Missing email or password");
        return;
    }
    const connection = await conn.getConnection();
    try{
        console.log("enter before query")
        const select_customer = 'SELECT * FROM customers c JOIN customers_data cd ON c.id = cd.customer_id WHERE (cd.customer_id, cd.snap_timestamp) IN (SELECT customer_id, MAX(snap_timestamp) FROM customers_data GROUP BY customer_id) AND c.deleted=false AND cd.email=?;';
        const [rows] = await connection.query(select_customer, [req.body.email]);
        if(rows.length === 0) {
            res.status(404).send("customer not found");
            connection.release();
        }else{
            console.log('customer with name: ' + rows[0].first_name + ' selected!\n ', rows)
            const bcryptValue = await bcrypt.compare(req.body.password, rows[0].pass);
            if(bcryptValue === true) {
                let token = await generateAccessToken(rows[0].first_name);
                console.log(token)
                const payload = {
                    "customer_id": rows[0].customer_id,
                    "first_name": rows[0].first_name,
                    "last_name": rows[0].last_name,
                    "age": rows[0].age,
                    "email": rows[0].email,
                    "jwttoken": token
                }
                res.status(200).send(payload);
                connection.release();
            }else{
                res.status(401).send("Wrong credentials");
                connection.release();
            }
        }
    }catch(err){
            connection.release();
            throw err;
    }
});

// Authentication router

export async function generateAccessToken(user) {
    return jwt.sign({user}, process.env.JWT_TOKEN, {expiresIn: '1800s'});
}

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}

export default router;