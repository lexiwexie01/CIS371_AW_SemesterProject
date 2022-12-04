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

/* Display login page */
app.get('/assignment-scheduler/login', (req, res) => {
    assignmentSchedulerController.showUserLogin(req, res);
});

app.post('assignment-scheduler/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    res.send(`Username: ${email} Password: ${password}`);
  });

/* Create a new user from users page*/
app.post('/assignment-scheduler/signup', (req, res) => {
    assignmentSchedulerController.createUser(req, res);
});

/* Display a form to create a new user */
app.get('/assignment-scheduler/signup', (req, res) => {
    assignmentSchedulerController.newUser(req, res);
});

/* Display details for one user */
app.get('/assignment-scheduler/:id', (req, res) => {
    assignmentSchedulerController.showUser(req, res);
});

/* Edit a user */
app.get('/assignment-scheduler/:id/edit', (req, res) => {
    assignmentSchedulerController.editUser(req, res);
});

/* Delete a user */
app.post('/assignment-scheduler/:id/delete', (req, res) => {
    assignmentSchedulerController.deleteUser(req, res);
});

/* Display a form to delete a user */
app.get('/assignment-scheduler/:id/delete', (req, res) => {
    assignmentSchedulerController.deleteUserForm(req, res);
});

/* Update a user */
app.post('/assignment-scheduler/:id', (req, res) => {
    assignmentSchedulerController.updateUser(req, res);
});

/* Display a user's assignments */
app.get('/assignment-scheduler/:id/assignments', (req, res) => {
    assignmentSchedulerController.showAssignments(req, res);
})

/* Display an assignment */
app.get('/assignment-scheduler/:id/assignments/:id', (req, res) => {
    assignmentSchedulerController.showAssignment(req, res);
})

app.listen(port, () => console.log(`Assignment Scheduler app listening on port ${port}!`))