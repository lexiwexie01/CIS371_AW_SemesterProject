let User = require('./User');

// Base taken from assignment 6
class MemoryUserDB {

    static allUsers() {
        return this.userList;
    }

    static find(id) {
        return this.userList.find((item) => item.id == id);
    }

    static create(userDescription) {
        let newUser = new User(userDescription);
        let x = 1;
        if (newUser.isValid(false)) {
            for (let i = 0; i < this.userList.length; i++) {
                if (this.userList[i].id === this.userList.length + x) {
                    x++;
                }
            }
            newUser.id = this.userList.length + x;
            this.userList.push(newUser);
        }
        return newUser;
    }

    static delete(user) {
        let delIndex = this.userList.indexOf(user);
        this.userList.splice(delIndex, 1);
        
        user.removeUser(user);
    }
}

MemoryUserDB.userList = [];

module.exports = MemoryUserDB;