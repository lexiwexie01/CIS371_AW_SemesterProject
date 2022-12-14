// Alexis Webster; Essay.js
const Assignment = require('../Assignment');

class Essay extends Assignment {
    constructor(description) {
        super(description);
        if (description) {
            this.pages = description.pages;
            this.requiresResearch = description.requiresResearch;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.pages || this.pages <= 0) {
            this.errors.push("The essay must have a minimum page amount.");
        }

        if (!this.requiresResearch) {
            this.errors.push("You must enter whether the essay requires research.");
        }

        return this.errors.length <= 0;
    }
}
module.exports = Essay;