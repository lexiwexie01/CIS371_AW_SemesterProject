// Express documentation: https://expressjs.com/en/api.html
// Base taken from assignment 6


/* Import the express npm module */
const express = require('express')

const UserController = require('./user/UserController');
const userController = new UserController();

/* Import the body-parser module.  (Used for parsing Post data) */
const bodyParser = require('body-parser');

/* Instantiate a server object*/
const app = express()
const port = 3000

/* Tell the server to use EJS by default */
app.set('view engine', 'ejs');

/* Parse the request body if there is POST data */
app.use(bodyParser.urlencoded({ extended: true }));

/* Display all users */
app.get('/users', (req, res) => {
    userController.index(req, res);
});

/* Create a new user from users page*/
app.post('/scheduler/login', (req, res) => {
    userController.create(req, res);
});

/* Display a form to create a new user */
app.get('/users/new', (req, res) => {
    userController.newUser(req, res);
});

/* Display details for one user */
app.get('/users/:id', (req, res) => {
    userController.show(req, res);
});

/* Edit a user */
app.get('/users/:id/edit', (req, res) => {
    userController.edit(req, res);
});

/* Delete a user */
app.post('/users/:id/delete', (req, res) => {
    userController.deleteUser(req, res);
});

/* Display a form to delete a user */
app.get('/users/:id/delete', (req, res) => {
    userController.delete(req, res);
});

/* Update a user */
app.post('/users/:id', (req, res) => {
    console.log("Update: ");
    console.log(req.body);
    userController.update(req, res);
});




/* Launch the server */
app.listen(port, () => console.log(`Bug app listening on port ${port}!`))