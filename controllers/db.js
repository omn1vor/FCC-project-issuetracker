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
    
    if (!this.checkInput(body)) {        
      return done({ error: 'required field(s) missing' });
    }
    
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
      if (err) {
        console.log(err);
        return done({ error: 'could not update' });
      }
      done(null, data);
    });
  }

  this.getIssuesByProject = function(project, query, done) {
    
    let filter = { project: project };
    for (let key in query) {
      filter[key] = query[key];
    }
    
    Issue.find(filter, (err, data) => {
      if (err) {
        console.log(err);
        return done({ error: 'could not get issues list' });
      }
      done(null, data);
    })
  }

  this.updateIssue = function(id, fields, done) {
    
    if (!fields.hasOwnProperty('_id')) {
      return done({ error: 'missing _id' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return done({ error: 'could not update', _id: id });
    }

    let updatableFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'created_on', 'project'];
    let fieldsToUpdate = { updated_on: Date() };
    let fieldsExist = false;

    updatableFields.forEach(i => {
      if (fields.hasOwnProperty(i) && (fields[i] || i == 'open')) {
        fieldsExist = true;
          fieldsToUpdate[i] = fields[i];
      }  
    });
    
    //console.log(fieldsExist, 'sent: ', fields, 'to update: ', fieldsToUpdate);

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
        //console.log(err, data);
        if (err || !data) {
          console.log(err);
          return done({ error: 'could not update', _id: id });
        };
        done(null, { result: 'successfully updated', _id: id });
      }
    )
 }

  this.deleteIssue = function(project, body, done) {
    
    if (!body.hasOwnProperty('_id')) {
      return done({ error: 'missing _id' });
    }

    if (!mongoose.Types.ObjectId.isValid(body._id)) {
      //console.log('id ' + body._id + ' is not valid!')
      return done({ error: 'could not delete', _id: body._id });
    }

    Issue.deleteOne(
    { _id: body._id, project: project },    
    (err, data) => {
        //console.log(err, data);
        if (err || !data.deletedCount) {
          console.log(err);
          return done({ error: 'could not delete', _id: body._id });
        };        
        done(null, { result: 'successfully deleted', _id: body._id });
      }
    )
  }
}

module.exports = db;