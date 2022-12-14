// Alexis Webster
const Assignment = require('../Assignment');

class Studying extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.studyGuide = description.studyGuide;
            this.numQuestions = description.numQuestions;
            this.numTopics = description.numTopics;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (this.studyGuide == null || this.studyGuide == undefined) {
            this.errors.push("You must enter whether you have a study guide.");
        }

        if ((!this.numQuestions || this.numQuestions <= 0) && this.studyGuide) {
            this.errors.push("The study guide must have a number of questions.");
        }

        if ((!this.numTopics || this.numTopics <= 0) && !this.studyGuide) {
            this.errors.push("The study guide must have a number of questions.");
        }

        return this.errors.length <= 0;
    }
}