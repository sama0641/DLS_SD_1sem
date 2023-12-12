import express from "express";
import { getAdmins, getAdminById, getDeletedAdmins, createAdmin, updateAdmin, deleteAdmin } from "./routers/admin-router.js";
import userRouter from "./routers/admin-router.js";
import authRouter from "./routers/auth-router.js";
import { loginAdmin } from "./routers/auth-router.js";
import customerRouter from "./routers/customer-router.js";
import { sendToQueueFunc } from "./routers/customer-router.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fs from "fs";
import morganMiddleware from './middleware/morgan-middleware.js';
import logger from "./utils/logger.js";
import { log } from "console";

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(authRouter);
app.use(customerRouter);
app.use(morganMiddleware);

// GRAPHQL
const typeDefs = fs.readFileSync('./graphql/schema.graphql', 'utf8');

const resolvers = {
    Query: {
        GetAdmins: async () => {
            try {
                const admins = await getAdmins();
                logger.verbose(admins)
                return admins;
            } catch (err) {
                logger.error(err);
            }
        },
        GetAdminById: async (_, { admin_id }) => {
            try {
                const admin = await getAdminById(admin_id);
                return admin;
            } catch (err) {
                logger.error(err);
            }
        },
        GetDeletedAdmins: async () => {
            try {
                const admins = await getDeletedAdmins();
                return admins;
            } catch (err) {
                logger.error(err);
            }
        },
        CreateAdmin: async (_, { username, email, pass }) => {
            try {
                const values = { username, email, pass };
                const admin = await createAdmin(values);
                return admin;
            } catch (err) {
                logger.error(err);
            }
        },
        UpdateAdmin: async (_, { admin_id, username, email, pass }) => {
            try {
                const values = { admin_id, username, email, pass };
                const admin = await updateAdmin(values);
                return admin;
            } catch (err) {
                logger.error(err);
            }
        },
        DeleteAdmin: async (_, { admin_id }) => {
            try {
                const admin = await deleteAdmin(admin_id);
                return admin;
            } catch (err) {
                logger.error(err);
            }
        },
        GetCustomers: async () => {
            try {
                const msg = { typeOfMessage: "readAll", body: { Read: "GotAll" } };
                console.log(msg)
                const response = await sendToQueueFunc(msg);
                console.log(response);
                return response
            } catch (err) {
                logger.error("something error", err);
            }
        },
        GetCustomerById: async (_, { customer_id }) => {
            try {
                const msg = { typeOfMessage: "readSingle", body: { id: customer_id } };
                const result = await sendToQueueFunc(msg);
                logger.verbose("THIS IS THE RESULT: ", result);
                return result;
            } catch (err) {
                logger.error(err);
            }
        },
        GetDeletedCustomers: async () => {
            try {
                const msg = { typeOfMessage: "readDeleted", body: { Read: "Deleted" } };
                const result = await sendToQueueFunc(msg);
                logger.verbose("THIS IS THE RESULT: ", result);
                return result;
            } catch (err) {
                logger.error(err);
            }
        },
    },
    Mutation: {
        Login: async (_, { username, pass }) => {
            try {
                const msg = {"username":username, "password":pass}
                const loginData = await loginAdmin(msg);
                console.log(loginData.msg)
                return loginData.msg;
            } catch (err) {
                logger.error(err);
            }
        },
        CreateCustomer: async (_, { firstname, lastname, age, email, password }) => {
            try {
                const msg = { typeOfMessage: "create", body: { firstname, lastname, age, email, password } };
                console.log("msg:", msg)
                const result = await sendToQueueFunc(msg);
                if(result === "customer added") {
                    return {firstname: firstname, lastname: lastname, age: age, email: email, password: password}
                    }
                logger.verbose("THIS IS THE RESULT: ", result);
                return result;
            } catch (err) {
                logger.error(err);
            }
        },
        UpdateCustomer: async (_, { customer_id, firstname, lastname, age, email, password }) => {
            try {
                const msg = { typeOfMessage: "update", body: { customer_id, firstname, lastname, age, email, password } };
                const result = await sendToQueueFunc(msg);
                logger.verbose("THIS IS THE RESULT: ", result);
                return result;
            } catch (err) {
                logger.error(err);
            }
        },
        DeleteCustomer: async (_, { customer_id }) => {
            try {
                const msg = { typeOfMessage: "delete", body: { id: customer_id } };
                const result = await sendToQueueFunc(msg);
                logger.verbose("THIS IS THE RESULT: ", result);
                return result;
            } catch (err) {
                logger.error(err);
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// SWAGGER
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
                url: process.env.SWAGGER_URL || "http://localhost:3000",
            },
        ],
    },
    apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;

const { url } = await startStandaloneServer(server, { listen: { port: PORT }, });
logger.verbose(`🚀  Server ready at: ${url}`);

//app.listen(PORT, () => console.log("Server running on:", PORT));