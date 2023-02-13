import express from "express";
import userRouter from "./routers/user-router.js";

const app = express();

app.use(userRouter);

const PORT = 5050;
app.listen(PORT, () => console.log("Server running on:", PORT));