let emailUserList = [];

// Base of this model taken from assignment 6.
class User {
    constructor(description) {
        // thumbnail can be blank.
        if (description) {
            this.uid = description.uid;
            this.fname = description.fname;
            this.lname = description.lname;
            this.email = description.email;
            this.password = description.password;
        }
        emailUserList.push(this);
        this.errors = [];
    }

    isValid(update) {
        this.errors = [];

        if (!this.fname || this.fname.length <= 0) {
            this.errors.push("The user must have a first name.");
        }
        if (!this.lname || this.lname.length <= 0) {
            this.errors.push("The user must have a last name.");
        }

        for (let i = 0; i < emailUserList.length; i++) {
            if (this.email === emailUserList[i].email && this.uid !== emailUserList[i].uid) {
                this.errors.push("The email must be unique.");
            }
            if (update && this.uid === emailUserList[i].uid) {
                emailUserList[i].email = this.email;
            }
        }

        if (!this.password || !this.password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            this.errors.push("The password must be at least 8 characters and have at least 1 symbol, uppercase character, lowercase character, and number.");
        }

        return this.errors.length <= 0;
    }

    removeUser() {
        for (let i = 0; i < emailUserList.length; i++) {
            if (this.uid === emailUserList[i].uid) {
                emailUserList.splice(i, 1);
            }
        }
    }
}
module.exports = User;