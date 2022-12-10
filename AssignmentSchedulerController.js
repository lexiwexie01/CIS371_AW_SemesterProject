// Alexis Webster

const Assignment = require('./assignment/Assignment');
const User = require('./user/User');
const removeUser = require('./user/User');
const AssignmentSchedulerDB = require('./AssignmentSchedulerDB');



// Base from assignment 6
class AssignmentSchedulerController {
    // For "userlist" page, which is for testing
    async indexUsers(req, res) {
        let users = await AssignmentSchedulerDB.allUsers();
        res.render('user/userIndex', { users: users });
    }


    // Guest assignment functions
    async showGuestAssignments(req, res) {
        let assignments = await AssignmentSchedulerDB.allGuestAssignments();
        res.render('guestAssignment/guestAssignmentIndex', {assignments: assignments})
    }

    newGuestAssignment(req, res) {
        res.render('guestAssignment/guestAssignmentNew', { assignment: new Assignment() });
    }

    async createGuestAssignment(req, res) {
        console.log("About to create guest assignment");
        console.log(req.body);
        let latestGuestAssignment = await AssignmentSchedulerDB.createGuestAssignment(req.body.assignment);

        if (latestGuestAssignment.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignment-scheduler/guest` });
            res.end();
        } else {
            res.render('guestAssignment/guestAssignmentNew', { assignment: latestGuestAssignment });
        }
    }

    async showGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            res.render('guestAssignment/guestAssignmentView', { assignment: assignment });
        }
    }

    async editGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            res.render('guestAssignment/guestAssignmentEdit', { assignment: assignment });
        }
    }

    async updateGuestAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findGuestAssignment(aid);

        let testGuestAssignment = new Assignment(req.body.assignment);
        if (!testGuestAssignment.isValid()) {
            testGuestAssignment.aid = assignment.aid;
            res.render('guestAssignment/assignmentEdit', { assignment: testGuestAssignment });
            return;
        }
        if (!assignment) {
            res.send("Could not find guest assignment with id of " + aid);
        } else {
            assignment.name = req.body.assignment.name;
            assignment.dueDate = req.body.assignment.dueDate;
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
            res.render('guestAssignment/guestAssignmentDeleteForm', { assignment: assignment });
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
            res.end();
        }
    }


    // User functions
    async showUserLogin(req, res) {
        res.render('user/userLogin', {email: "", password: ""});
    }

    async logInUser(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        let user = await AssignmentSchedulerDB.findUserFromLogin(email, password);
        
        if (!user) {
            res.send("Could not find user with those credentials.");
        } else {
            req.session.user = user;
            res.render('user/userView', { user: req.session.user });
        }
    }

    logOutUser(req, res) {
        req.session.destroy(function(){
            console.log("user logged out.")
         });
        res.redirect('/assignment-scheduler-login');
    }

    newUser(req, res) {
        res.render('user/userNew', { user: new User() });
    }

    async createUser(req, res) {
        console.log("About to create user");
        console.log(req.body);
        let latestUser = await AssignmentSchedulerDB.createUser(req.body.user);

        if (latestUser.isValid(false)) {

            // Route back to login page
            res.writeHead(302, { 'Location': `/assignment-scheduler-login` });
            res.end();
        } else {
            res.render('user/userNew', { user: latestUser });
        }
    }

    async editUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            res.render('user/userEdit', { user: req.session.user });
        }
    }

    async updateUser(req, res) {
        console.log("Preparing to update user in controller");
        let uid = req.session.user.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        let testUser = new User(req.body.user);
        if (!testUser.isValid(true)) {
            testUser.uid = user.uid;
            res.render('user/userEdit', { user: testUser });
            return;
        }
        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            user.fname = req.body.user.fname;
            user.lname = req.body.user.lname;
            user.email = req.body.user.email;
            user.password = req.body.user.password;

            req.session.user = user;

            console.log("About to call update");
            AssignmentSchedulerDB.updateUser(user);

            res.writeHead(302, { 'Location': `/assignment-scheduler/${user.uid}` });
            res.end();
        }
    }

    async deleteUserForm(req, res) {
        let uid = req.session.user.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            res.render('user/userDeleteForm', { user: req.session.user });
        }
    }

    async deleteUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            new removeUser(user);

            AssignmentSchedulerDB.deleteUser(user);
            req.session.destroy(function(){
                console.log("user logged out.")
             });
            res.writeHead(302, { 'Location': `/assignment-scheduler-login` });
            res.end();
        }
    }

    async showUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
                res.render('user/userView', { user: req.session.user });
        }
    }

    async rawUserIndex(req, res) {
        let users = await AssignmentSchedulerDB.allUsers();
        res.send(users);
    } 

    
    // Assignment functions
    newAssignment(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Assignment(), user: req.session.user, req: req});
    }

    async createAssignment(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createAssignment(req.body.assignment, req.session.user);

        if (latestAssignment.isValid(false)) {
            
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }
    
    async editAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            if (assignment.userId === req.session.user.uid) {
                res.render('assignment/assignmentEdit', { assignment: assignment, user: req.session.user, req: req });
            } else {
                res.send("Please log in.");
            }
        }
    }

    async deleteAssignmentForm(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            res.render('assignment/assignmentDeleteForm', { assignment: assignment, user: req.session.user });
        }
    }

    async deleteAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            AssignmentSchedulerDB.deleteAssignment(assignment);
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user.uid}/assignments` });
            res.end();
        }
    }

    async updateAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        let testAssignment = new Assignment(req.body.assignment);
        if (!testAssignment.isValid()) {
            testAssignment.aid = assignment.aid;
            res.render('assignment/assignmentEdit', { assignment: testAssignment, user: req.session.user, req: req });
            return;
        }
        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            assignment.name = req.body.assignment.name;
            assignment.dueDate = req.body.assignment.dueDate;

            console.log("About to call update");
            AssignmentSchedulerDB.updateAssignment(assignment);

            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user.uid}/assignments/${assignment.aid}` });
            res.end();
        }
    }

    async showAssignments(req, res) {
        let assignments = await AssignmentSchedulerDB.userAssignments(req.session.user.uid);
        res.render('assignment/assignmentIndex', {assignments: assignments, user: req.session.user, req: req});
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
            if (assignment.userId === req.session.user.uid) {
                res.render('assignment/assignmentView', { assignment: assignment, user: req.session.user });
            } else {
                res.send("Please log in.");
            }
        }
    }

}

module.exports = AssignmentSchedulerController;