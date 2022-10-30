class Reading extends Assignment {
    constructor(description) {
        // thumbnail can be blank.
        if (description) {
            super(description);
            this.pages = description.pages;
        }
        this.errors = [];
    }
}