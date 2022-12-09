class Reading extends Assignment {
    constructor(description) {
        if (description) {
            super(description);
            this.page_ranges = description.page_ranges;
        }
        this.errors = [];
    }
}