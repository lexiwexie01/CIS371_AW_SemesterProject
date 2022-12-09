class Homework extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
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