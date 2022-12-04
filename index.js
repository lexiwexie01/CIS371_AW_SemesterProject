// Base taken from assignment 6
// Alexis Webster

const express = require('express')

const AssignmentSchedulerController = require('./AssignmentSchedulerController');
const assignmentSchedulerController = new AssignmentSchedulerController();

const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

/*---------Views for testing----------*/
app.get('/userlist', (req, res) => {
    assignmentSchedulerController.indexUsers(req, res);
});

/*---------Log in to existing User account----------*/

/* Display login page */
app.get('/assignment-scheduler/login', (req, res) => {
    assignmentSchedulerController.showUserLogin(req, res);
});

/* Log in to assignment scheduler */
app.post('assignment-scheduler/login', (req, res) => {
    assignmentSchedulerController.showUser(req, res);
});

/*---------Make a new User----------*/

/* Display a form to create a new user */
app.get('/assignment-scheduler/signup', (req, res) => {
    assignmentSchedulerController.newUser(req, res);
});

/* Create a new user from users page*/
app.post('/assignment-scheduler/signup', (req, res) => {
    assignmentSchedulerController.createUser(req, res);
});

/*---------Display a User----------*/

/* Display details for one user */
app.get('/assignment-scheduler/:uid', (req, res) => {
    assignmentSchedulerController.showUser(req, res);
});

/*---------Edit a User----------*/

/* Edit a user */
app.get('/assignment-scheduler/:uid/edit', (req, res) => {
    assignmentSchedulerController.editUser(req, res);
});

/* Update a user */
app.post('/assignment-scheduler/:uid', (req, res) => {
    assignmentSchedulerController.updateUser(req, res);
});

/*---------Delete a User----------*/

/* Display a form to delete a user */
app.get('/assignment-scheduler/:uid/delete', (req, res) => {
    assignmentSchedulerController.deleteUserForm(req, res);
});

/* Delete a user */
app.post('/assignment-scheduler/:uid/delete', (req, res) => {
    assignmentSchedulerController.deleteUser(req, res);
});

/*---------Display assignment(s)----------*/

/* Display a user's assignments */
app.get('/assignment-scheduler/:uid/assignments', (req, res) => {
    assignmentSchedulerController.showAssignments(req, res);
})

/* Display an assignment */
app.get('/assignment-scheduler/:uid/assignments/:aid', (req, res) => {
    assignmentSchedulerController.showAssignment(req, res);
})

/*---------Delete Assignment(s)----------*/

/* Display a form to delete an assignment */
app.get('/assignment-scheduler/:uid/assignments/:aid/delete', (req, res) => {
    assignmentSchedulerController.deleteAssignmentForm(req, res);
});

/* Delete a user */
app.post('/assignment-scheduler/:uid/assignments/:aid/delete', (req, res) => {
    assignmentSchedulerController.deleteAssignment(req, res);
});

app.listen(port, () => console.log(`Assignment Scheduler app listening on port ${port}!`))