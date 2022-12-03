const User = require('./User');
const UserDB = require('../UserDB');

// Base taken from assignment 6
class UserController {

    

    

    

    



    async rawIndex(req, res) {
        let users = await UserDB.allUsers();
        res.send(users);
    } 

    

    newUser(req, res) {
        res.render('userNew', { user: new User() });
    }

    

}

module.exports = UserController;