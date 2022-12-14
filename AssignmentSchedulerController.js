// Alexis Webster

const Assignment = require('./assignment/Assignment');
const Essay = require('./assignment/assignment.types/Essay');
const Homework = require('./assignment/assignment.types/Homework');
const Presentation = require('./assignment/assignment.types/Presentation');
const Reading = require('./assignment/assignment.types/Reading');
const Studying = require('./assignment/assignment.types/Studying');
const Video = require('./assignment/assignment.types/Video');

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

    newEssay(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Essay(), user: req.session.user, req: req});
    }

    newHomework(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Homework(), user: req.session.user, req: req});
    }

    newPresentation(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Presentation(), user: req.session.user, req: req});
    }

    newReading(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Reading(), user: req.session.user, req: req});
    }

    newStudying(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Studying(), user: req.session.user, req: req});
    }

    newVideo(req, res) {
        res.render('assignment/assignmentNew', {assignment: new Video(), user: req.session.user, req: req});
    }

    async createAssignment(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createAssignment(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }

    async createEssay(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createEssay(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }

    async createHomework(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createHomework(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }

    async createPresentation(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createPresentation(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }

    async createReading(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createReading(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }

    async createStudying(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createStudying(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
            // Back to assignment list
            res.writeHead(302, { 'Location': `/assignment-scheduler/${req.session.user}/assignments` });
            res.end();
        } else {
            res.render('assignment/assignmentNew', { assignment: latestAssignment, user: req.session.user, req: req });
        }
    }

    async createVideo(req, res) {
        let latestAssignment = await AssignmentSchedulerDB.createVideo(req.body.assignment, req.session.user);

        if (latestAssignment.isValid()) {
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

            // Update essay
            if (req.body.assignment.pages && req.body.assignment.pages > 0 && (req.body.assignment.requiresResearch !== null && req.body.assignment.requiresResearch !== undefined && req.body.assignment.requiresResearch !== "")) {
                console.log("Updating essay");
                assignment.pages = req.body.assignment.pages;
                assignment.requiresResearch = req.body.assignment.requiresResearch;
                AssignmentSchedulerDB.updateEssay(assignment);
            } // Update homework
            else if (req.body.assignment.numQuestions && req.body.assignment.numQuestions > 0 && (req.body.assignment.studyGuide === null || req.body.assignment.studyGuide === undefined || req.body.assignment.studyGuide === "")) {
                console.log("Updating homework");
                assignment.numQuestions = req.body.assignment.numQuestions;
                AssignmentSchedulerDB.updateHomework(assignment);
            } // Update presentation
            else if (!req.body.assignment.numQuestions && req.body.assignment.requiresResearch !== null && req.body.assignment.requiresResearch !== undefined && req.body.assignment.requiresResearch !== "" && req.body.assignment.requiresSlideshow !== null && req.body.assignment.requiresSlideshow !== undefined && req.body.assignment.requiresSlideshow !== "") {
                console.log("Updating presentation");
                assignment.requiresResearch = req.body.assignment.requiresResearch;
                assignment.requiresSlideshow = req.body.assignment.requiresSlideshow;
                AssignmentSchedulerDB.updatePresentation(assignment);
            } // Update reading
            else if (req.body.assignment.pages && req.body.assignment.pages > 0) {
                console.log("Updating reading");
                assignment.pages = req.body.assignment.pages;
                AssignmentSchedulerDB.updateReading(assignment);
            } // Update studying
            else if (req.body.assignment.studyGuide !== null && req.body.assignment.studyGuide !== undefined && req.body.assignment.studyGuide !== "" && ((req.body.assignment.numQuestions > 0) || (req.body.assignment.numTopics > 0))) {
                console.log("Updating studying");
                assignment.studyGuide = req.body.assignment.studyGuide;
                assignment.numQuestions = req.body.assignment.numQuestions;
                assignment.numTopics = req.body.assignment.numTopics;
                AssignmentSchedulerDB.updateStudying(assignment);
            } // Update video 
            else if (req.body.assignment.minutes && req.body.assignment.minutes > 0) {
                console.log("Updating video");
                assignment.minutes = req.body.assignment.minutes;
                AssignmentSchedulerDB.updateVideo(assignment);
            } else {
                console.log("Updating assignment");
                AssignmentSchedulerDB.updateAssignment(assignment);
            }

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
                if (assignment.pages && assignment.pages > 0 && (assignment.requiresResearch !== null && assignment.requiresResearch !== undefined && assignment.requiresResearch !== "")) {
                    res.render('assignment/assignment.types/views/essayView', { assignment: assignment, user: req.session.user });
                } else if (assignment.numQuestions && assignment.numQuestions > 0 && (assignment.studyGuide === null || assignment.studyGuide === undefined || assignment.studyGuide === "")) {
                    res.render('assignment/assignment.types/views/homeworkView', { assignment: assignment, user: req.session.user });
                } else if (!assignment.numQuestions && assignment.requiresResearch !== null && assignment.requiresResearch !== undefined && assignment.requiresResearch !== "" && assignment.requiresSlideshow !== null && assignment.requiresSlideshow !== undefined && assignment.requiresSlideshow !== "") {
                    res.render('assignment/assignment.types/views/presentationView', { assignment: assignment, user: req.session.user });
                } else if (assignment.pages && assignment.pages > 0) {
                    res.render('assignment/assignment.types/views/readingView', { assignment: assignment, user: req.session.user });
                } else if (assignment.studyGuide !== null && assignment.studyGuide !== undefined && assignment.studyGuide !== "" && ((assignment.numQuestions > 0) || (assignment.numTopics > 0))) {
                    res.render('assignment/assignment.types/views/studyingView', { assignment: assignment, user: req.session.user });
                } else if (assignment.minutes && assignment.minutes > 0) {
                    res.render('assignment/assignment.types/views/videoView', { assignment: assignment, user: req.session.user });
                } else {
                    res.render('assignment/assignmentView', { assignment: assignment, user: req.session.user });
                }
            } else {
                res.send("Please log in.");
            }
        }
    }

}

module.exports = AssignmentSchedulerController;