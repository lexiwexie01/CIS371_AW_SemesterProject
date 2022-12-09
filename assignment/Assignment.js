// Alexis Webster

class Assignment {
    constructor(description) {
        if (description) {
            this.aid = description.aid;
            this.name = description.name;
            this.userId = description.userId;
            this.dueDate = description.dueDate;

            this.daysTillDue = description.daysTillDue;
        }
        this.errors = [];
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
function getDaysTillDue(dueDate) {
    let today = new Date();
    let due = new Date(dueDate);
    let amtTime = due.getTime() - today.getTime();
    return Math.ceil(amtTime / (1000 * 3600 * 24));
}

module.exports = Assignment;