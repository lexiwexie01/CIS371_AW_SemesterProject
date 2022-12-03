const User = require('./User');
const UserDB = require('../UserDB');

// Base taken from assignment 6
class UserController {

    newUser(req, res) {
        res.render('userNew', { user: new User() });
    }

    async edit(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            res.render('userEdit', { user: user });
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            res.render('userDeleteForm', { user: user });
        }
    }

    async deleteUser(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            UserDB.delete(user);
            let users = await UserDB.allUsers();
            res.render('userLogin', { users: users });
        }
    }

    async update(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);

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
            user.assignmentList = req.body.user.assignmentList;

            console.log("About to call update");

            // Send a redirect to the "show" route for the new user.
            res.writeHead(302, { 'Location': `/users/${user.id}` });
            res.end();
        }
    }

    async index(req, res) {
        let users = await UserDB.allUsers();
        res.render('userLogin', { users: users });
    }

    async rawIndex(req, res) {
        let users = await UserDB.allUsers();
        res.send(users);
    } 

    async create(req, res) {
        console.log("About to create user");
        console.log(req.body);
        let newUser = await UserDB.create(req.body.user);

        if (newUser.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignments` });
            res.end();
        } else {
            res.render('userNew', { user: newUser });
        }
    }

    newUser(req, res) {
        res.render('userNew', { user: new User() });
    }

    async show(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);

        if (!user) {
            res.send("Could not find user with id of " + id);
        } else {
            res.render('userView', { user: user });
        }
    }

}

module.exports = UserController;