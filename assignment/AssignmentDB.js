// Alexis Webster

var sqlite3 = require('sqlite3').verbose();
let Assignment = require('./Assignment');

class AssignmentDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Assignments (id INTEGER PRIMARY KEY, name TEXT NOT NULL, FOREIGN KEY(assignmentId) REFERENCES Users(id));');
        });
    }

    static allAssignments() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Assignments', (err, response) => {
                resolve(response.map((item) => new Assignment(item)));
            });
        });
    }

    static find(id) {
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

    static create(description) {
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

    
    static deleteAssignment(assignment) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Assignments WHERE id="${assignment.id}"`, function(err, data) {
                assignment.pk = this.lastID;
                resolve(assignment)
            })
        })
    }


    static update(assignment) {
        this.db.run(`UPDATE Assignments SET name="${assignment.name}", userId="${assignment.userId}"`);
    }
}


AssignmentDB.db = new sqlite3.Database('assignment.sqlite');

module.exports = AssignmentDB;