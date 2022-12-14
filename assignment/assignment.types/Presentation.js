// Alexis Webster
const Assignment = require('../Assignment');

class Presentation extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.requiresResearch = description.requiresResearch;
            this.requiresSlideshow = description.requiresSlideshow;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.requiresResearch) {
            this.errors.push("You must enter whether the presentation requires research.");
        }

        if (!this.requiresSlideshow) {
            this.errors.push("You must enter whether the presentation requires a slideshow.");
        }

        return this.errors.length <= 0;
    }
}
module.exports = Presentation;