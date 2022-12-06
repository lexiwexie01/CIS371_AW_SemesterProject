class Reading extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.pages = description.pages;
        }
        this.errors = [];
    }
}