// Alexis Webster

var sqlite3 = require('sqlite3').verbose();
let Assignment = require('./assignment/Assignment');
const Essay = require('./assignment/assignment.types/Essay');
const Homework = require('./assignment/assignment.types/Homework');
const Presentation = require('./assignment/assignment.types/Presentation');
const Reading = require('./assignment/assignment.types/Reading');
const Studying = require('./assignment/assignment.types/Studying');
const Video = require('./assignment/assignment.types/Video');
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

            this.db.run('CREATE TABLE IF NOT EXISTS Users (uid INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, CONSTRAINT unique_email UNIQUE (email));');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("1", "Alexis", "Webster", "alexis@web.com", "$Password1");');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("2", "test", "user", "test@user.com", "@TestUser2");');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("3", "George", "Washington", "george@wash.com", "GeorgePass@1");');
            this.db.run('INSERT INTO Users (uid, fname, lname, email, password) VALUES ("4", "Cat", "Dog", "cat@dog.org", "CatDog#4");');
            
            // requiresResearch, requiresSlideshow, and studyGuide are booleans
            this.db.run('CREATE TABLE IF NOT EXISTS Assignments (aid INTEGER PRIMARY KEY, name TEXT NOT NULL, userId INTEGER NOT NULL, dueDate TEXT NOT NULL, pages INTEGER, numQuestions INTEGER, requiresResearch TEXT, requiresSlideshow TEXT, studyGuide TEXT, numTopics INTEGER, minutes INTEGER, FOREIGN KEY(userId) REFERENCES Users(uid));');
            this.db.run('INSERT INTO Assignments (aid, name, userId, dueDate) VALUES ("1", "Essay", "1", "2022-12-22");');
            this.db.run('INSERT INTO Assignments (aid, name, userId, dueDate) VALUES ("2", "Project", "1", "2022-12-30");');
            this.db.run('INSERT INTO Assignments (aid, name, userId, dueDate) VALUES ("3", "Essay", "1", "2022-12-20");');
            this.db.run('INSERT INTO Assignments (aid, name, userId, dueDate) VALUES ("4", "Homework", "3", "2022-12-27");');

            this.db.run('CREATE TABLE IF NOT EXISTS GuestAssignments (aid INTEGER PRIMARY KEY, name TEXT NOT NULL, userId, dueDate TEXT NOT NULL);');
            this.db.run('INSERT INTO GuestAssignments (aid, name, userId, dueDate) VALUES ("1", "Essay", "guest", "2022-12-25");');


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

    /* ----- Create methods for all assignment types ----- */
    static createAssignment(description, user) {
        let newAssignment = new Assignment(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static createEssay(description, user) {
        let newAssignment = new Essay(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate, pages, requiresResearch) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}", "${newAssignment.pages}", "${newAssignment.requiresResearch}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static createHomework(description, user) {
        let newAssignment = new Homework(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate, numQuestions) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}", "${newAssignment.numQuestions}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static createPresentation(description, user) {
        let newAssignment = new Presentation(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate, requiresResearch, requiresSlideshow) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}", "${newAssignment.requiresResearch}", "${newAssignment.requiresSlideshow}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static createReading(description, user) {
        let newAssignment = new Reading(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate, pages) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}", "${newAssignment.pages}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static createStudying(description, user) {
        let newAssignment = new Studying(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate, studyGuide, numQuestions, numTopics) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}", "${newAssignment.studyGuide}", "${newAssignment.numQuestions}", "${newAssignment.numTopics}")`,
                    function(err, data) {
                        newAssignment.aid = lastAID + 1;
                        resolve(newAssignment);
                    });
            });
        } else {
            return newAssignment;
        }
    }

    static createVideo(description, user) {
        let newAssignment = new Video(description);
        if (newAssignment.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Assignments (name, userId, dueDate, minutes) VALUES ("${newAssignment.name}", "${user.uid}", "${newAssignment.dueDate}", "${newAssignment.minutes}")`,
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
        this.db.run(`UPDATE Assignments SET name="${assignment.name}", userId="${assignment.userId}", dueDate="${assignment.dueDate}" WHERE aid="${assignment.aid}"`);
    }

    static updateEssay(essay) {
        this.db.run(`UPDATE Assignments SET name="${essay.name}", dueDate="${essay.dueDate}", pages="${essay.pages}", requiresResearch="${essay.requiresResearch}" WHERE aid="${essay.aid}"`);
    }

    static updateHomework(homework) {
        this.db.run(`UPDATE Assignments SET name="${homework.name}", userId="${homework.userId}", dueDate="${homework.dueDate}", numQuestions="${homework.numQuestions}" WHERE aid="${homework.aid}"`);
    }

    static updatePresentation(presentation) {
        this.db.run(`UPDATE Assignments SET name="${presentation.name}", userId="${presentation.userId}", dueDate="${presentation.dueDate}", requiresSlideshow="${presentation.requiresSlideshow}", requiresResearch="${presentation.requiresResearch}" WHERE aid="${presentation.aid}"`);
    }

    static updateReading(reading) {
        this.db.run(`UPDATE Assignments SET name="${reading.name}", userId="${reading.userId}", dueDate="${reading.dueDate}", pages="${reading.pages}" WHERE aid="${reading.aid}"`);
    }

    static updateStudying(studying) {
        this.db.run(`UPDATE Assignments SET name="${studying.name}", userId="${studying.userId}", dueDate="${studying.dueDate}", studyGuide="${studying.studyGuide}", numQuestions="${studying.numQuestions}", numTopics="${studying.numTopics}" WHERE aid="${studying.aid}"`);
    }

    static updateVideo(video) {
        this.db.run(`UPDATE Assignments SET name="${video.name}", userId="${video.userId}", dueDate="${video.dueDate}", minutes="${video.minutes}" WHERE aid="${video.aid}"`);
    }

    
    /* ----- Guest Assignment Methods ----- */
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
                this.db.run(`INSERT INTO GuestAssignments (name, dueDate) VALUES ("${newGuestAssignment.name}", "${newGuestAssignment.dueDate}")`,
                    function(err, data) {
                        newGuestAssignment.aid = lastGuestAID + 1;
                        newGuestAssignment.userId = "guest";
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
        this.db.run(`UPDATE GuestAssignments SET name="${assignment.name}", dueDate="${assignment.dueDate}" WHERE aid="${assignment.aid}"`);
    }
}


AssignmentSchedulerDB.db = new sqlite3.Database('assignment-scheduler.sqlite');

module.exports = AssignmentSchedulerDB;