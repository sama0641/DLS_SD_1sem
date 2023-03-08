import express from "express";
import userRouter from "./routers/user-router.js";

const app = express();

app.use(userRouter);

app.get("/", (req, res) =>{
    res.send("Welcome to admin frontpage!")
})

const PORT = 3000;
app.listen(PORT, () => console.log("Server running on:", PORT));