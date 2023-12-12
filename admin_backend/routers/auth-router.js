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
    try{
        const result = await loginAdmin(req.body);
        console.log("result", result)
        if(result.msg == null || result.msg == undefined){
            res.status(404).send("No admin found");
        }else{
            res.status(result.status).send(result.msg);
        }
    }catch(err){
        logger.error(err);
        res.status(500).send("Something went wrong");
    }
});

export async function loginAdmin(values){
    console.log("Login request received", values);
    if (!values.username || !values.password) {
        return {status:400, msg:"Missing email or password"};
    }
    const connection = await conn.getConnection();
    try{
        console.log("enter before query")
        const select_admin = 'SELECT * FROM admins a JOIN admins_data ad ON a.id = ad.admin_id WHERE (ad.admin_id, ad.snap_timestamp) IN (SELECT admin_id, MAX(snap_timestamp) FROM admins_data GROUP BY admin_id) AND a.deleted=false AND ad.username=?;';
        const [rows] = await connection.query(select_admin, [values.username]);
        if(rows.length === 0) {
            connection.release();
            return {status:404, msg:"admin not found in db"}
        }else{
            console.log('admin with name: ' + rows[0].username + ' selected!\n ', rows)
            const bcryptValue = await bcrypt.compare(values.password, rows[0].pass);
            console.log(bcryptValue)
            if(bcryptValue === true) {
                let token = await generateAccessToken(rows[0].username);
                const payload = {
                    "jwttoken": token,
                    "admin_id": rows[0].admin_id,
                    "username": rows[0].username,
                    "email": rows[0].email,
                    "is_superuser": rows[0].is_superuser,
                }
                connection.release();
                return {status:200, msg:payload}
            }else{
                connection.release();
                return {status:401, msg:"Wrong credentials"}
            }
        }
    }catch(err){
            connection.release();
            throw err;
    }
}
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