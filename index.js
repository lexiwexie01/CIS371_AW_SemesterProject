// Base taken from assignment 6
// Alexis Webster

const express = require('express')

const UserController = require('./user/UserController');
const userController = new UserController();

const AssignmentController = require('./assignment/AssignmentController');
const assignmentController = new AssignmentController();

const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.set('view engine', 'ejs');

/* Parse the request body if there is POST data */
app.use(bodyParser.urlencoded({ extended: true }));

/* Display all users */
app.get('/users', (req, res) => {
    userController.index(req, res);
});

/* Create a new user from users page*/
app.post('/users', (req, res) => {
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
    userController.update(req, res);
});

/* Display a user's assignments */
app.get('/users/:id/assignments', (req, res) => {
    assignmentController.show(req, res);
})

app.listen(port, () => console.log(`Assignment Scheduler app listening on port ${port}!`))