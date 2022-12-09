class Video extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.minutes = description.minutes;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.minutes || this.minutes <= 0) {
            this.errors.push("The video must have a number of minutes.");
        }

        return this.errors.length <= 0;
    }
}