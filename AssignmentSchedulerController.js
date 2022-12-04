// Alexis Webster

const Assignment = require('./assignment/Assignment');
const User = require('./user/User');
const AssignmentSchedulerDB = require('./AssignmentSchedulerDB');
// Base taken from assignment 6
class AssignmentSchedulerController {

    newUser(req, res) {
        res.render('userNew', { user: new User() });
    }

    // TODO
    newAssignment(req, res) {
        res.render('assignmentNew', {assignment: new Assignment()});
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

    async createAssignment(req, res) {
        console.log("About to create new assignment");
        console.log(req.body);
        let latestAssignment = await AssignmentSchedulerDB.createAssignment(req.body.assignment);
        let user = await AssignmentSchedulerDB.findUser()

        if (latestAssignment.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignment-scheduler/${latestUser.uid}/assignments/${latestAssignment.aid}` });
            res.end();
        } else {
            res.render('assignmentNew', { assignment: latestAssignment });
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
    
    async editAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            res.render('assignmentEdit', { assignment: assignment });
        }
    }

    async deleteUserForm(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.find(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            res.render('userDeleteForm', { user: user });
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

    async deleteUser(req, res) {
        let uid = req.params.uid;
        let user = await AssignmentSchedulerDB.findUser(uid);

        if (!user) {
            res.send("Could not find user with id of " + uid);
        } else {
            AssignmentSchedulerDB.deleteUser(user);
            let users = await AssignmentSchedulerDB.allUsers();
            res.render('userLogin', { users: users });
        }
    }

    // TODO
    async deleteAssignment(req, res) {
        
    }

    async updateUser(req, res) {
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

            console.log("About to call update");

            // Send a redirect to the "show" route for the new user.
            res.writeHead(302, { 'Location': `/assignment-scheduler/${user.uid}` });
            res.end();
        }
    }

    // TODO
    async updateAssignment(req, res) {
        
    }

    async showUserLogin(req, res) {
        res.render('userLogin', {user: new User()});
    }

    // TODO
    async indexAssignment(req, res) {
        
    }

    async rawUserIndex(req, res) {
        let users = await AssignmentSchedulerDB.allUsers();
        res.send(users);
    } 

    async rawAssignmentIndex(req, res) {
        let assignments = await AssignmentSchedulerDB.allAssignments();
        res.send(assignments);
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

    async showAssignment(req, res) {
        let aid = req.params.aid;
        let assignment = await AssignmentSchedulerDB.findAssignment(aid);

        if (!assignment) {
            res.send("Could not find assignment with id of " + aid);
        } else {
            res.render('assignmentShow', { assignment: assignment });
        }
    }

}

module.exports = AssignmentSchedulerController;