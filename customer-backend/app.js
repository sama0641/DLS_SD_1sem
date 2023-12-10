import express from "express";
import userRouter from "./routers/user-router.js";
import accountRouter from "./routers/account-router.js";
import transactionRouter from "./routers/transaction-router.js";
//import amqp from 'amqplib/callback_api.js';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
app.use(express.json());

// Routes
app.use(userRouter);
app.use(accountRouter);
app.use(transactionRouter);

// Swagger Options, used for documentation and UI
const options = {
    definition: {
        openapi: "3.0.0",
        info: {	
            title: "Customer API",
            version: "1.0.0",
            description: "A simple Express Library API for customers",
        },
        servers: [
            {
                url: "http://localhost:5050",
            },
        ],
    },
    apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


/*amqp.connect('amqp://localhost', (err, conn) => {
    if(err) {
        throw err;
    }
    conn.createChannel((err, ch) => {

        if(err) {
            throw err;
        }
        conn.createChannel((err, ch) => {
            if(err) {
                throw err;
            }
            let queueName = 'servermessage';
            ch.assertQueue(queueName, {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
            ch.consume(queueName, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
                ch.ack(msg);
            });
        });
    });
});*/

const PORT = 5050;
app.listen(PORT, () => console.log("Server running on:", PORT));