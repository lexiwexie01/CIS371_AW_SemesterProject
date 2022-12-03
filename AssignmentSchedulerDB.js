// Alexis Webster

var sqlite3 = require('sqlite3').verbose();
let Assignment = require('./assignment/Assignment');
let User = require('./user/User');

class AssignmentSchedulerDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Users (id INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, );');
            this.db.run('INSERT INTO Users (fname, lname, email, password) VALUES ("Alexis", "Webster", "alexis@web.com", "password");');
            
            this.db.run('CREATE TABLE Assignments (id INTEGER PRIMARY KEY, name TEXT NOT NULL, FOREIGN KEY(assignmentId) REFERENCES Users(id));');
        });
    }

    static allUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Users', (err, response) => {
                resolve(response.map((item) => new User(item)));
            });
        });
    }

    static allAssignments() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Assignments', (err, response) => {
                resolve(response.map((item) => new Assignment(item)));
            });
        });
    }

    static findUser(id) {
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

    static findAssignment(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Assignments WHERE (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new Assignment(rows[0]));
                } else {
                    reject(`Id ${id} not found`);
                }
            });
        });
    }

    static createUser(description) {
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

    static createAssignment(description) {
        let newAssignment = new Assignment(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId) VALUES ("${newAssignment.name}", "${newAssignment.userId}")`,
                    function(err, data) {
                        newAssignment.id = this.lastID;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
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

    static deleteAssignment(assignment) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Assignments WHERE id="${assignment.id}"`, function(err, data) {
                assignment.pk = this.lastID;
                resolve(assignment)
            })
        })
    }

    static updateUser(user) {
        this.db.run(`UPDATE Users SET fname="${user.fname}", lname="${user.lname}", email="${user.email}", password="${user.password}" WHERE id="${user.id}"`);
    }

    static updateAssignment(assignment) {
        this.db.run(`UPDATE Assignments SET name="${assignment.name}", userId="${assignment.userId}" WHERE id="${assignment.id}"`);
    }
}


AssignmentSchedulerDB.db = new sqlite3.Database('assignment-scheduler.sqlite');

module.exports = AssignmentSchedulerDB;