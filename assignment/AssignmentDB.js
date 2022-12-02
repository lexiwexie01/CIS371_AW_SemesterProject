// Alexis Webster

var sqlite3 = require('sqlite3').verbose();
let Assignment = require('./Assignment');

class AssignmentDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Assignments (id INTEGER PRIMARY KEY, name TEXT NOT NULL, FOREIGN KEY(userId) REFERENCES Users(id));');
        });
    }

    static allAssignments() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Users', (err, response) => {
                resolve(response.map((item) => new User(item)));
            });
        });
    }

    static find(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Users WHERE (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new User(rows[0]));
                } else {
                    reject(`Id ${id} not found`);
                }
            });
        });
    }

    static create(description) {
        let newUser = new User(description);
        if (newUser.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Users (fname, lname, email, password) VALUES ("${newUser.fname}", "${newUser.lname}", "${newUser.email}", "${newUser.password}")`,
                    function(err, data) {
                        newUser.id = this.lastID;
                        resolve(newUser);
                    });
            });
        } else {
            return newUser;
        }
    }

    
    static deleteUser(user) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Users WHERE id="${user.id}"`, function(err, data) {
                user.pk = this.lastID;
                resolve(user)
            })
        })
    }


    static update(user) {
        this.db.run(`UPDATE Users SET fname="${user.fname}", lname="${user.lname}", email="${user.email}", password="${user.password}" WHERE id="${user.id}"`);
    }
}


UserDB.db = new sqlite3.Database('user.sqlite');

module.exports = UserDB;