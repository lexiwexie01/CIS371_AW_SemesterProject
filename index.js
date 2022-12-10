// Base taken from assignment 6
// Alexis Webster

const express = require('express')
const multer = require('multer')
const upload = multer()
const session = require('express-session')
const cookieParser = require('cookie-parser')

const AssignmentSchedulerController = require('./AssignmentSchedulerController');
const assignmentSchedulerController = new AssignmentSchedulerController();

const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "12345"}));

app.use(bodyParser.urlencoded({ extended: true }));

function checkSignIn(req, res, next){
    if(req.session.user){
       next();     //If session exists, proceed to page
    } else {
       var err = new Error("Not logged in!");
       console.log(req.session.user);
       next(err);  //Error, trying to access unauthorized page!
    }
 }

/*---------Open the guest planner page----------*/
app.get('/assignment-scheduler/guest', (req, res) => {
    assignmentSchedulerController.showGuestAssignments(req, res);
});

/*---------Make a guest assignment----------*/
/* Display a form to create a new guest assignment */
app.get('/assignment-scheduler/guest/new', (req, res) => {
    assignmentSchedulerController.newGuestAssignment(req, res);
});

/* Create a new guest assignment from guest planner page*/
app.post('/assignment-scheduler/guest/new', (req, res) => {
    assignmentSchedulerController.createGuestAssignment(req, res);
});

/*---------Display a guest assignment----------*/
/* Display details for one guest assignment */
app.get('/assignment-scheduler/guest/:aid', (req, res) => {
    assignmentSchedulerController.showGuestAssignment(req, res);
});

/*---------Edit a guest assignment----------*/
/* Edit a guest assignment */
app.get('/assignment-scheduler/guest/:aid/edit', (req, res) => {
    assignmentSchedulerController.editGuestAssignment(req, res);
});

/* Update a guest assignment */
app.post('/assignment-scheduler/guest/:aid', (req, res) => {
    assignmentSchedulerController.updateGuestAssignment(req, res);
});

/*---------Delete a guest assignment----------*/
/* Display a form to delete a guest assignment */
app.get('/assignment-scheduler/guest/:aid/delete', (req, res) => {
    assignmentSchedulerController.deleteGuestAssignmentForm(req, res);
});

/* Delete a guest assignment */
app.post('/assignment-scheduler/guest/:aid/delete', (req, res) => {
    assignmentSchedulerController.deleteGuestAssignment(req, res);
});


/*---------Views for testing----------*/
app.get('/userlist', (req, res) => {
    assignmentSchedulerController.indexUsers(req, res);
});

/*---------Log in/out to existing User account----------*/
/* Display login page */
app.get('/assignment-scheduler-login', (req, res) => {
    assignmentSchedulerController.showUserLogin(req, res);
});

/* Log in to assignment scheduler */
app.post('/assignment-scheduler-login', (req, res) => {
    assignmentSchedulerController.logInUser(req, res);
});

/* Log out of assignment scheduler */
app.get('assignment-scheduler/:uid/logout', (req, res) => {
    assignmentSchedulerController.logOutUser(req, res);
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
app.get('/assignment-scheduler/:uid', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.showUser(req, res);
});

/*---------Edit a User----------*/
/* Edit a user */
app.get('/assignment-scheduler/:uid/edit', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.editUser(req, res);
});

/* Update a user */
app.post('/assignment-scheduler/:uid', (req, res) => {
    assignmentSchedulerController.updateUser(req, res);
});

/*---------Delete a User----------*/

/* Display a form to delete a user */
app.get('/assignment-scheduler/:uid/delete', checkSignIn,  (req, res, next) => {
    assignmentSchedulerController.deleteUserForm(req, res);
});

/* Delete a user */
app.post('/assignment-scheduler/:uid/delete', (req, res) => {
    assignmentSchedulerController.deleteUser(req, res);
});

/*---------Create a new assignment----------*/

/* Display a form to create a new assignment */
app.get('/assignment-scheduler/:uid/assignments/new', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.newAssignment(req, res);
});

/* Create a new assignment from assignments page*/
app.post('/assignment-scheduler/:uid/assignments/new', (req, res) => {
    assignmentSchedulerController.createAssignment(req, res);
});

/*---------Display assignment(s)----------*/

/* Display a user's assignments */
app.get('/assignment-scheduler/:uid/assignments', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.showAssignments(req, res);
})

/* Display an assignment */
app.get('/assignment-scheduler/:uid/assignments/:aid', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.showAssignment(req, res);
})

/*---------Delete Assignment(s)----------*/

/* Display a form to delete an assignment */
app.get('/assignment-scheduler/:uid/assignments/:aid/delete', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.deleteAssignmentForm(req, res);
});

/* Delete a user */
app.post('/assignment-scheduler/:uid/assignments/:aid/delete', (req, res) => {
    assignmentSchedulerController.deleteAssignment(req, res);
});

/*---------Edit an assignment----------*/

/* Edit an assignment */
app.get('/assignment-scheduler/:uid/assignments/:aid/edit', checkSignIn, (req, res, next) => {
    assignmentSchedulerController.editAssignment(req, res);
});

/* Update an assignment */
app.post('/assignment-scheduler/:uid/assignments/:aid', (req, res) => {
    assignmentSchedulerController.updateAssignment(req, res);
});

app.listen(port, () => console.log(`Assignment Scheduler app listening on port ${port}!`))