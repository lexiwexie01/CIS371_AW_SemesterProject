const Assignment = require('./Assignment');
const AssignmentDB = require('./AssignmentDB');

// Base taken from assignment 6
class AssignmentController {

    newAssignment(req, res) {
        
    }

    async edit(req, res) {
        let id = req.params.id;
        let assignment = await AssignmentDB.find(id);

        if (!assignment) {
            res.send("Could not find assignment with id of " + id);
        } else {
            res.render('assignmentEdit', { assignment: assignment });
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let assignment = await AssignmentDB.find(id);

        if (!assignment) {
            res.send("Could not find assignment with id of " + id);
        } else {
            res.render('assignmentDeleteForm', { assignment: assignment });
        }
    }

    async deleteAssignment(req, res) {
        
    }

    async update(req, res) {
        
    }

    async index(req, res) {
        
    }

    async rawIndex(req, res) {
        
    } 

    async create(req, res) {
        console.log("About to create new assignment");
        console.log(req.body);
        let newAssignment = await AssignmentDB.create(req.body.assignment);

        if (newAssignment.isValid(false)) {

            res.writeHead(302, { 'Location': `/assignments` });
            res.end();
        } else {
            res.render('assignmentNew', { assignment: newAssignment });
        }
    }

    newAssignment(req, res) {
        
    }

    async show(req, res) {
        
    }

}

module.exports = AssignmentController;