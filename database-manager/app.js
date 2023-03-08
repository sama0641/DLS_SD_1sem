import express from "express";
//import userRouter from "./routers/user-router.js";

const app = express();

//app.use(userRouter);

app.get("/", (req, res) => {
    res.send("Welcome to db manager frontpage!")
})
const PORT = 5050;
app.listen(PORT, () => console.log("Server running on:", PORT));