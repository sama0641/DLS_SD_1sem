import express from "express";
import http from "http";

const router = express.Router();

router.get("/api/users", (req, res) => {
    
    const request = http.get("URL to database manager server", (res) => {
        if (res.statusCode !== 200) {
            console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
            res.resume();
            return;
        }

        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        const response = data.json();

    });


});

export default router;