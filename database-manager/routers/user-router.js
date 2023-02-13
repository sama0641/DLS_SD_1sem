import express from "express";
import db from "../database-connection.js";

const router = express.Router();
router.use(express.json());

router.get("/api/customers", async (req, res) => {
    const query = "SELECT * FROM customers";
    try{
        const [rows, fields] = await db.promise().query(query);
        res.send(rows);
    }catch(error){
        console.log(error);
        res.status(500);
    }
});

router.post("/api/customers", async (req, res) => {
    const {uuid, firstname, lastname, email, password} = req.body;
    const query = "INSERT INTO customers (uuid, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)";
    try{
        const [rows, fields] = await db.promise().query(query, [uuid, firstname, lastname, email, password]);
        res.send("👍");
    }catch(error){
        console.log(error);
        res.status(500);
    }
});

export default router;