// Alexis Webster
const Assignment = require('../Assignment');

class Reading extends Assignment {
    constructor(description) {
        super(description);
        if (description) {
            this.pages = description.pages;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.pages || this.pages <= 0) {
            this.errors.push("The reading assignment must have a number of pages.");
        }

        return this.errors.length <= 0;
    }
}

module.exports = Reading;