// Alexis Webster

var sqlite3 = require('sqlite3').verbose();
let Assignment = require('./assignment/Assignment');
let User = require('./user/User');
let lastUID = 0;
let lastAID = 0;
let lastGuestAID = 0;

class AssignmentSchedulerDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('DROP TABLE IF EXISTS Users')
            this.db.run('DROP TABLE IF EXISTS Assignments')
            this.db.run('DROP TABLE IF EXISTS GuestAssignments')

            this.db.run('CREATE TABLE IF NOT EXISTS Users (uid INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL);');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("1", "Alexis", "Webster", "alexis@web.com", "$Password1");');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("2", "test", "user", "test@user.com", "@TestUser2");');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("3", "George", "Washington", "george@wash.com", "GeorgePass@1");');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("4", "Cat", "Dog", "cat@dog.org", "CatDog#4");');
            
            this.db.run('CREATE TABLE IF NOT EXISTS Assignments (aid INTEGER PRIMARY KEY, name TEXT NOT NULL, userId INTEGER NOT NULL, FOREIGN KEY(userId) REFERENCES Users(uid));');
            this.db.run('INSERT INTO Assignments (aid, name, userId) VALUES ("1", "Essay", "1");');
            this.db.run('INSERT INTO Assignments (aid, name, userId) VALUES ("2", "Project", "1");');
            this.db.run('INSERT INTO Assignments (aid, name, userId) VALUES ("3", "Essay", "1");');
            this.db.run('INSERT INTO Assignments (aid, name, userId) VALUES ("4", "Homework", "3");');

            this.db.run('CREATE TABLE IF NOT EXISTS GuestAssignments (aid INTEGER PRIMARY KEY, name TEXT NOT NULL);');
            this.db.run('INSERT INTO GuestAssignments (aid, name) VALUES ("1", "Essay");');


        });
    }

    static userAssignments(uid) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Assignments WHERE (userId == ${uid})`, (err, response) => {
                resolve(response.map((item) => new Assignment(item)));
            });
        });
    }

    static allUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Users', (err, response) => {
                resolve(response.map((item) => new User(item)));
            });
        });
    }

    static findUser(uid) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Users WHERE (uid == ${uid})`, (err, result) => {
                resolve(result);
            });
        });
    }

    static findUserFromLogin(email, password) {
        console.log(typeof(email));
        console.log(typeof(password));
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Users WHERE email LIKE "${email}" AND email LIKE "${email}"`, (err, result) => {
                resolve(result);
            });
        });
    }

    static createUser(description) {
        let newUser = new User(description);
        if (newUser.isValid(false)) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Users (fname, lname, email, password) VALUES ("${newUser.fname}", "${newUser.lname}", "${newUser.email}", "${newUser.password}")`,
                    function(err, data) {
                        newUser.uid = lastUID + 1;
                        resolve(newUser);
                    });
            });
        } else {
            return newUser;
        }
    }

    static deleteUser(user) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Users WHERE uid="${user.uid}"`, function(err, data) {
                user.uid = lastUID;
                resolve(user)
            })
        })
    }

    static updateUser(user) {
        this.db.run(`UPDATE Users SET fname="${user.fname}", lname="${user.lname}", email="${user.email}", password="${user.password}" WHERE uid="${user.uid}"`);
    }

    static allAssignments() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Assignments', (err, response) => {
                resolve(response.map((item) => new Assignment(item)));
            });
        });
    }

    static findAssignment(aid) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Assignments WHERE (aid == ${aid})`, (err, result) => {
                resolve(result);
            });
        });
    }

    static createAssignment(description, user) {
        let newAssignment = new Assignment(description);
        if (newAssignment.isValid(false)) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId) VALUES ("${newAssignment.name}", "${user.uid}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static deleteAssignment(assignment) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Assignments WHERE aid="${assignment.aid}"`, function(err, data) {
                assignment.aid = lastAID;
                resolve(assignment)
            })
        })
    }

    static updateAssignment(assignment) {
        this.db.run(`UPDATE Assignments SET name="${assignment.name}", userId="${assignment.userId}" WHERE aid="${assignment.aid}"`);
    }

    static allGuestAssignments() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM GuestAssignments', (err, response) => {
                resolve(response.map((item) => new Assignment(item)));
            });
        });
    }

    static findGuestAssignment(aid) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM GuestAssignments WHERE (aid == ${aid})`, (err, result) => {
                resolve(result);
            });
        });
    }

    static createGuestAssignment(description) {
        let newGuestAssignment = new Assignment(description);
        if (newGuestAssignment.isValid(false)) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO GuestAssignments (name) VALUES ("${newGuestAssignment.name}")`,
                    function(err, data) {
                        newGuestAssignment.aid = lastGuestAID + 1;
                        resolve(newGuestAssignment);
                    });
            });
        } else {
            return newGuestAssignment;
        }
    }

    static deleteGuestAssignment(assignment) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM GuestAssignments WHERE aid="${assignment.aid}"`, function(err, data) {
                assignment.aid = lastGuestAID;
                resolve(assignment)
            })
        })
    }

    static updateGuestAssignment(assignment) {
        this.db.run(`UPDATE GuestAssignments SET name="${assignment.name}" WHERE aid="${assignment.aid}"`);
    }
}


AssignmentSchedulerDB.db = new sqlite3.Database('assignment-scheduler.sqlite');

module.exports = AssignmentSchedulerDB;