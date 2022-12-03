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
        
    }

    async createUser(req, res) {
        console.log("About to create user");
        console.log(req.body);
        let latestUser = await AssignmentSchedulerDB.create(req.body.user);

        if (latestUser.isValid(false)) {

            res.writeHead(302, { 'Location': `/users` });
            res.end();
        } else {
            res.render('userNew', { user: latestUser });
        }
    }

    async createAssignment(req, res) {
        console.log("About to create new assignment");
        console.log(req.body);
        let latestAssignment = await AssignmentSchedulerDB.create(req.body.assignment);

        if (latestAssignment.isValid(false)) {

            res.writeHead(302, { 'Location': `/users` });
            res.end();
        } else {
            res.render('assignmentNew', { assignment: latestAssignment });
        }
    }

    async editUser(req, res) {
        let id = req.params.id;
        let user = await AssignmentSchedulerDB.findUser(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            res.render('userEdit', { user: user });
        }
    }
    
    async editAssignment(req, res) {
        let id = req.params.id;
        let assignment = await AssignmentSchedulerDB.findAssignment(id);

        if (!assignment) {
            res.send("Could not find assignment with id of " + id);
        } else {
            res.render('assignmentEdit', { assignment: assignment });
        }
    }

    async deleteUserForm(req, res) {
        let id = req.params.id;
        let user = await AssignmentSchedulerDB.find(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            res.render('userDeleteForm', { user: user });
        }
    }

    async deleteAssignmentForm(req, res) {
        let id = req.params.id;
        let assignment = await AssignmentSchedulerDB.findAssignment(id);

        if (!assignment) {
            res.send("Could not find assignment with id of " + id);
        } else {
            res.render('assignmentDeleteForm', { assignment: assignment });
        }
    }

    async deleteUser(req, res) {
        let id = req.params.id;
        let user = await AssignmentSchedulerDB.findUser(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
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
        let id = req.params.id;
        let user = await AssignmentSchedulerDB.findUser(id);

        let testUser = new User(req.body.user);
        if (!testUser.isValid(true)) {
            testUser.id = user.id;
            res.render('userEdit', { user: testUser });
            return;
        }
        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            user.fname = req.body.user.fname;
            user.lname = req.body.user.lname;
            user.email = req.body.user.email;

            console.log("About to call update");

            // Send a redirect to the "show" route for the new user.
            res.writeHead(302, { 'Location': `/users/${user.id}` });
            res.end();
        }
    }

    // TODO
    async updateAssignment(req, res) {
        
    }

    async indexUser(req, res) {
        let users = await AssignmentSchedulerDB.allUsers();
        res.render('userLogin', { users: users });
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
        let id = req.params.id;
        let user = await AssignmentSchedulerDB.findUser(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            res.render('userView', { user: user });
        }
    }

    async showAssignment(req, res) {
        let id = req.params.id;
        let assignment = await AssignmentSchedulerDB.findAssignment(id);

        if (!assignment) {
            res.send("Could not find assignment with id of " + id);
        } else {
            if (assignm)
            res.render('assignmentShow', { assignment: assignment });
        }
    }

}

module.exports = AssignmentController;