// ----- CUSTOMER ROUTES -----

// ----- GET ALL CUSTOMER -----
/** 
 * @openapi
 * /customers:
 *   get:
 *     tags:
 *      - Customer
 *     summary: Returns all customers
 *     description: Returns all customers with shapshot data joined
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
*/

// ----- GET CUSTOMER BY ID -----
/**
 * @openapi
 * /customers/{id}:
 *   get:
 *     tags:
 *      - Customer
 *     summary: Returns a specifik customer
 *     description: Returns a specifik customer with shapshot data joined
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: Numeric ID of the customer to get
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: Customer not found
*/
// ----- GET DELETED CUSTOMERS -----
/**
 * @openapi
 * /customers_deleted:
 *   get:
 *     tags:
 *      - Customer
 *     summary: Returns all deleted customers
 *     description: Returns all deleted customers with shapshot data joined
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No deleted customers found
*/

// ----- CREATE CUSTOMER -----
/**
 * @openapi
 * /customer:
 *   post:
 *     tags:
 *      - Customer
 *     summary: Create a new customer
 *     description: Create a new customer and its connected snapshot data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 */

// ----- UPDATE CUSTOMER -----
/**
 * @openapi
 * /update_customer:
 *  post:
 *    tags:
 *      - Customer
 *    summary: Update a customer
 *    description: Data about a customer is updated by creating a new customer_data
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *               type: integer
 *              firstname:
 *               type: string
 *              lastname:
 *               type: string 
 *              age:
 *               type: integer
 *              email:
 *               type: string
 *               format: email
 *              password:
 *               type: string
 *               format: password   
 *    responses:
 *      200:
 *        description: A successful response
 */

// ----- DELETE CUSTOMER -----
/**
 * @openapi
 * /delete_customer:
 *   post:
 *     tags:
 *      - Customer
 *     summary: Delete a customer
 *     description: This one deletes a customer by setting deleted to true but it is still in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *             example:
 *               id: 1
 *     responses:
 *       200:
 *         description: A successful response
 */

// ----- ACCOUNT ROUTES -----

// ----- GET ALL ACCOUNTS -----
/**
 * @openapi
 * /accounts:
 *   get:
 *     tags:
 *      - Account
 *     summary: Returns all existing accounts
 *     description: This one returns all existing accounts on all customers
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No accounts found
 */

// ----- GET ALL ACCOUNTS BY CUSTOMER_ID -----

/**
 * @openapi
 * /accounts/{customer_id}:
 *  get:
 *     tags:
 *      - Account
 *     summary: Returns a all accounts for a specific customer
 *     description: Returns a specifik account with shapshot data joined
 *     parameters:
 *     - in: path
 *       name: customer_id
 *       schema:
 *         type: integer
 *       required: true
 *       description: Numeric ID of the customer to get an account from
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: account not found
*/

// ----- GET SPECIFIK ACCOUNT BY ID -----

/**
 * @openapi
 * /account_id:
 *   post:
 *     tags:
 *      - Account
 *     summary: Get a specifik account for a customer
 *     description: This one returns a specifik account for a customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_id:
 *                type: integer
 *               customer_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No customer found
 */
// ----- CREATE ACCOUNT -----
/**
 * @openapi
 * /account:
 *   post:
 *     tags:
 *      - Account
 *     summary: Create a new account
 *     description: This one creates a new account for a given customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No customer found
 */
// ----- UPDATE ACCOUNT -----
/**
 * @openapi
 * /update_account:
 *   post:
 *     tags:
 *      - Account
 *     summary: Update an account
 *     description: This one updates an account for a given customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               customer_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No account or customer found 
 */
// ----- DELETE ACCOUNT -----
/** 
 * @openapi
 * /delete_account:
 *   post:
 *     tags:
 *      - Account
 *     summary: Delete an account
 *     description: This one deletes an account for a given customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               customer_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No account or customer found
 */

// ----- GET BALANCE -----
/**
 * @openapi
 * /balance/{account_id}:
 *   get:
 *     tags:
 *      - Account
 *     summary: Get the balance for an account
 *     description: Returns the balance for an account based on the account_id
 *     parameters:
 *     - in: path
 *       name: account_id
 *       schema:
 *         type: integer
 *       required: true
 *       description: Numeric ID of the account to get
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: Customer not found
*/

// ----- TRANSACTION ROUTES -----

// ----- GET ALL TRANSACTIONS -----
/**
 * @openapi
 * /transactions:
 *  get:
 *    tags:
 *     - Transaction
 *    summary: Returns all transactions
 *    description: This one returns all transactions
 *    responses:
 *     200:
 *      description: A successful response
 *     400:
 *      description: Bad request
 *     404:
 *      description: No transactions found
 */

// ----- CREATE TRANSACTION -----
/**
 * @openapi
 * /transaction:
 *  post:
 *   tags:
 *    - Transaction
 *   summary: Create a new transaction
 *   description: This one creates a new transaction
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        sender_account_id:
 *         type: integer
 *        reciever_account_id:
 *         type: integer
 *        amount:
 *         type: integer
 *   responses:
 *    200:
 *     description: A successful response
 *    400:
 *     description: Bad request
 *    404:
 *     description: No account found
 */