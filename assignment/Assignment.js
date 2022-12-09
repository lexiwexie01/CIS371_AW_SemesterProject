// Alexis Webster

class Assignment {
    constructor(description) {
        if (description) {
            this.aid = description.aid;
            this.name = description.name;
            this.userId = description.userId;
            this.dueDate = description.dueDate;
        }
        this.errors = [];

        let today = new Date();
        let due = new Date(this.dueDate);
        let amtTime = due.getTime() - today.getTime();
        this.daysTillDue = Math.ceil(amtTime / (1000 * 3600 * 24));
    }

    isValid() {
        this.errors = [];

        if (!this.name || this.name.length <= 0) {
            this.errors.push("The assignment must have a name.");
        }

        if (!this.dueDate || this.dueDate <= 0) {
            this.errors.push("Please enter the due date for your assignment.");
        }

        return this.errors.length <= 0;
    }

}
module.exports = Assignment;