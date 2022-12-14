// Alexis Webster
const Assignment = require('../Assignment');

class Homework extends Assignment {
    constructor(description) {
        super(description);
        if (description) {
            this.numQuestions = description.numQuestions;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.numQuestions || this.numQuestions <= 0) {
            this.errors.push("The homework assignment must have a number of questions.");
        }

        return this.errors.length <= 0;
    }
}
module.exports = Homework;