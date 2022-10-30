class Assignment {
    constructor(description) {
        // thumbnail can be blank.
        if (description) {
            this.id = description.id;
            this.name = description.name;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.name || this.name.length <= 0) {
            this.errors.push("The assignment must have a name.");
        }

        return this.errors.length <= 0;
    }

}
module.exports = Assignment;