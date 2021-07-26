require('dotenv').config();
const mongoose = require('mongoose');

let Issue;

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env['DB'], { useNewUrlParser: true, useUnifiedTopology: true });


const { Schema } = mongoose;
const issueSchema = new Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
});

Issue = mongoose.model('Issue', issueSchema);

function db() {

  this.checkInput = function(body) {
    
    return (body.issue_title && body.issue_text && body.created_by);

  }

  this.addIssue = function(project, body, done) {
    const newIssue = new Issue({
      project: project,
      issue_title: body.issue_title,
      issue_text: body.issue_text,
      created_by: body.created_by,
      assigned_to: body.assigned_to || '',
      status_text: body.status_text || '',
      created_on: Date(),
      updated_on: Date(),
      open: true
    });
    
    newIssue.save((err, data) => {
      if (err) return console.log(err);      
      done(null, data);
    });
  }

  this.getIssuesByProject = function(project, query, done) {
    
    let filter = { project: project };
    for (let key in query) {
      filter[key] = query[key];
    }
    
    Issue.find(filter, (err, data) => {
      if (err) return console.log(err);
      done(null, data);
    })
  }

  this.updateIssue = function(id, fields, done) {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return done({ error: 'could not update', _id: id });
    }

    let updatableFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
    let fieldsToUpdate = { updated_on: Date() };
    let fieldsExist = false;

    updatableFields.forEach(i => {
      if (fields.hasOwnProperty(i)) {
        fieldsExist = true;
        if (fields[i] || i == 'open') {
          fieldsToUpdate[i] = fields[i];
        }
      }  
    });
    
    if (!fieldsExist) {
      //console.log('no update fields');
      return done({ error: 'no update field(s) sent', _id: id });
    }

    //console.log('updating', id, fieldsToUpdate);

    Issue.findByIdAndUpdate(
      id,
      fieldsToUpdate,
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
          return done({ error: 'could not update', _id: id });
        };
        done(null, data);
      }
    )
 }

  this.deleteIssue = function(project, id, done) {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return done({ error: 'could not delete', _id: id });
    }

    Issue.deleteOne(
    { _id: id, project: project },    
    (err, data) => {
        if (err) {
          console.log(err);
          return done({ error: 'could not delete', _id: id });
        };
        //console.log(data);
        done(null, data);
      }
    )
  
  }
}

module.exports = db;