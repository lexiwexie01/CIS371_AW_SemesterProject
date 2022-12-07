// Alexis Webster

const Assignment = require('./assignment/Assignment');
const User = require('./user/User');
const AssignmentSchedulerDB = require('./AssignmentSchedulerDB');
// Base taken from assignment 6
class AssignmentSchedulerController {

    // For "userlist" page, which is for testing
    async indexUsers(req, res) {
        let users = await AssignmentSchedulerDB.allUsers();
        res.render('userIndex', { users: users });
    }

    // Guest assignment functions
    async showGuestAssignments(req, res) {
        let assignments = await AssignmentSchedulerDB.allGuestAssignments();
        res.render('guestAssignmentIndex', {assignments: assignments})
    }

    newGuestAssignment(req, res) {
        res.render('guestAssignmentNew', { assignment: new Assignment() });
    }

    async createGuestAssignment(req, res) {
        console.log("About to create guest assignment");
        console.log(req.body);
        let latestGuestAssignment = await AssignmentSchedulerDB.createGuestAssignment(req.body.assignment);

        if (latestGuestAssignment.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignment-scheduler/${latestGuestAssignment.aid}` });
            res.end();
        } else {
            res.render('guestAssignmentNew', { assignment: latestGuestAssignment });
        }
    }

    async showGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            res.render('guestAssignmentView', { assignment: assignment });
        }
    }

    async editGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            res.render('guestAssignmentEdit', { assignment: assignment });
        }
    }

    async updateGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        let testGuestAssignment = new Assignment(req.body.assignment);
        if (!testGuestAssignment.isValid(true)) {
            testGuestAssignment.aid = assignment.aid;
            res.render('assignmentEdit', { assignment: testGuestAssignment });
            return;
        }
        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            assignment.name = req.body.assignment.name;
            // TODO: Add support for other variables if guest assignment is of another type

            console.log("About to call update");
            AssignmentSchedulerDB.updateGuestAssignment(assignment);

            res.writeHead(302, { 'Location': `/assignment-scheduler/guest/${assignment.aid}` });
            res.end();
        }
    }

    async deleteGuestAssignmentForm(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            res.render('guestAssignmentDeleteForm', { assignment: assignment });
        }
    }

    async deleteGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        if (!assignment) {
            assignment.send("Could not find guest assignment with id of " + aid);
        } else {
            AssignmentSchedulerDB.deleteGuestAssignment(assignment);
            res.writeHead(302, { 'Location': `/assignment-scheduler/guest` });
        }
    }


    // User functions
    async showUserLogin(req, res) {
        console.log("Login page showing from controller");
        res.render('userLogin', {email: "", password: ""});
    }

    async logInUser(req, res) {
        console.log("Logging in user from controller");
        let email = req.body.email;
        let password = req.body.password;
        console.log("Email: " + email);
        console.log("Password: " + password);

        let user = await AssignmentSchedulerDB.findUserFromLogin(email, password);
        console.log("User: "+ user);

        if (!user) {
            res.send("Could not find user with those credentials.");
        } else {
            res.render('userView', { user: user });
        }
    }

    newUser(req, res) {
        res.render('userNew', { user: new User() });
    }

    async createUser(req, res) {
        console.log("About to create user");
        console.log(req.body);
        let latestUser = await AssignmentSchedulerDB.createUser(req.body.user);

        if (latestUser.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignment-scheduler/${latestUser.uid}` });
            res.end();
        } else {
            res.render('userNew', { user: latestUser });
        }
    }

    async editUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            res.render('userEdit', { user: user });
        }
    }

    async updateUser(req, res) {
        console.log("Preparing to update user in controller");
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        let testUser = new User(req.body.user);
        if (!testUser.isValid(true)) {
            testUser.uid = user.uid;
            res.render('userEdit', { user: testUser });
            return;
        }
        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            user.fname = req.body.user.fname;
            user.lname = req.body.user.lname;
            user.email = req.body.user.email;
            user.password = req.body.user.password;

            console.log("About to call update");
            AssignmentSchedulerDB.updateUser(user);

            res.writeHead(302, { 'Location': `/assignment-scheduler/${user.uid}` });
            res.end();
        }
    }

    async deleteUserForm(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            res.render('userDeleteForm', { user: user });
        }
    }

    async deleteUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            AssignmentSchedulerDB.deleteUser(user);
            res.render('userLogin', {email: "", password: ""});
        }
    }

    async showUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            res.render('userView', { user: user });
        }
    }

    async rawUserIndex(req, res) {
        let users = await AssignmentSchedulerDB.allUsers();
        res.send(users);
    } 

    // Assignment functions
    newAssignment(req, res) {
        let uid = req.params.uid;
        let user = AssignmentSchedulerDB.findUser(uid);

        res.render('assignmentNew', {assignment: new Assignment(), user: user, req: req});
    }

    async createAssignment(req, res) {
        console.log("About to create new assignment");
        console.log(req.body);
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        let latestAssignment = await AssignmentSchedulerDB.createAssignment(req.body.assignment, user);

        if (latestAssignment.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignment-scheduler/${user.uid}/assignments/${latestAssignment.aid}` });
            res.end();
        } else {
            res.render('assignmentNew', { assignment: latestAssignment, user: user, req: req });
        }
    }
    
    async editAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            res.render('assignmentEdit', { assignment: assignment, req: req });
        }
    }

    async deleteAssignmentForm(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            res.render('assignmentDeleteForm', { assignment: assignment });
        }
    }

    async deleteAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            assignment.send("Could not find assignment with id of " + aid);
        } else {
            AssignmentSchedulerDB.deleteAssignment(assignment);
            res.writeHead(302, { 'Location': `/assignment-scheduler/${assignment.userId}/assignments` });
        }
    }

    async updateAssignment(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        let testAssignment = new Assignment(req.body.assignment);
        if (!testAssignment.isValid(true)) {
            testAssignment.aid = assignment.aid;
            res.render('assignmentEdit', { assignment: testAssignment, user: user, req: req });
            return;
        }
        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            assignment.name = req.body.assignment.name;

            console.log("About to call update");
            AssignmentSchedulerDB.updateAssignment(assignment);

            res.writeHead(302, { 'Location': `/assignment-scheduler/${user.uid}/assignments/${assignment.aid}` });
            res.end();
        }
    }

    async showAssignments(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        let assignments = await AssignmentSchedulerDB.userAssignments(uid);
        res.render('assignmentIndex', {assignments: assignments, user: user, req: req});
    }

    async rawAssignmentIndex(req, res) {
        let assignments = await AssignmentSchedulerDB.allAssignments();
        res.send(assignments);
    } 

    async showAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            res.render('assignmentView', { assignment: assignment });
        }
    }

}

module.exports = AssignmentSchedulerController;