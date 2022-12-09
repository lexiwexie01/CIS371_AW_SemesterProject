class Essay extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.pages = description.pages;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.pages || this.pages <= 0) {
            this.errors.push("The essay must have a minimum page amount.");
        }

        return this.errors.length <= 0;
    }
}