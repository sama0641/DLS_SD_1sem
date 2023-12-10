 // ----- GET ALL ADMINS -----
/** 
 * @openapi
 * /admins:
 *   get:
 *     summary: Returns all admins
 *     description: Returns all admins with shapshot data joined
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
*/
// ----- GET ADMIN BY ID -----

/**
 * @openapi
 * /admins/{id}:
 *   get:
 *     summary: Returns a specifik admin
 *     description: Returns a specifik admin with shapshot data joined
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: Numeric ID of the admin to get
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: admin not found
*/

// ----- GET DELETED ADMINS -----
/**
 * @openapi
 * /admins_deleted:
 *   get:
 *     summary: Returns all deleted admins
 *     description: Returns all deleted admins with shapshot data joined
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: No deleted admins found
*/

// ----- CREATE ADMIN -----
/**
 * @openapi
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     description: Create a new admin and its connected snapshot data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
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

// ----- UPDATE ADMIN -----
/**
 * @openapi
 * /update_admin:
 *  post:
 *    summary: Update a admin
 *    description: Data about a admin is updated by creating a new entry in the admin_data table
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              username:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: A successful response
 */

// ----- DELETE ADMIN -----
/**
 * @openapi
 * /delete_admin:
 *   post:
 *     summary: Delete an admin
 *     description: This one deletes an admin by setting deleted to true but it is still in the database
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