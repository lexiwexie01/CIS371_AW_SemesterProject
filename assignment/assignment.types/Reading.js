// Alexis Webster

class Reading extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.page_ranges = description.page_ranges;
        }
        this.errors = [];
    }

    isValid() {
        this.errors = [];

        if (!this.page_ranges || this.name.length <= 0) {
            this.errors.push("The reading assignment must have a page range.");
        }

        return this.errors.length <= 0;
    }
}