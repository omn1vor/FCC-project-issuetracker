const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', done => {
      chai
        .request(server)
        .post('/api/issues/test_suite')
        .send(
          { 
            "_id": "60ff1954a0ad4104b6d6d81c",
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error.",
            "created_by": "Joe",
            "assigned_to": "Joe",
            "status_text": "In QA"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'Fix error in posting data');
          assert.isOk(res.body.created_on);
          done();
        });
    });
    
    test('Create an issue with only required fields: POST request to /api/issues/{project}', done => {
      chai
        .request(server)
        .post('/api/issues/test_suite')
        .send(
          { 
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error.",
            "created_by": "Joe"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'Fix error in posting data');
          assert.equal(res.body.assigned_to, '', 'optional fields must return as empty strings');
          assert.isOk(res.body.created_on, 'optional dates must be set automatically');
          done();
        });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', done => {
      chai
        .request(server)
        .post('/api/issues/test_suite')
        .send(
          { 
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error."
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });

    test('View issues on a project: GET request to /api/issues/{project}', done => {
      chai
        .request(server)
        .get('/api/issues/test_suite')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isArray(res.body);
          done();
        });
    });
    
    test('View issues on a project with one filter: GET request to /api/issues/{project}', done => {
      chai
        .request(server)
        .get('/api/issues/test_suite?created_by=Joe')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isArray(res.body);
          done();
        });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', done => {
      chai
        .request(server)
        .get('/api/issues/test_suite?created_by=Joe&open=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isArray(res.body);
          done();
        });
    });

  test('Update one field on an issue: PUT request to /api/issues/{project}', done => {
      chai
        .request(server)
        .put('/api/issues/test_suite')
        .send(
          { 
            "_id": "60ff1954a0ad4104b6d6d81c",
            "issue_text": "text updated"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', done => {
      chai
        .request(server)
        .put('/api/issues/test_suite')
        .send(
          { 
            "_id": "60ff1954a0ad4104b6d6d81c",
            "issue_text": "text updated",
            "status_text": "status updated"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');          
          done();
        });
    });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', done => {
      chai
        .request(server)
        .put('/api/issues/test_suite')
        .send(
          {             
            "issue_text": "text updated",
            "status_text": "status updated"
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', done => {
      chai
        .request(server)
        .put('/api/issues/test_suite')
        .send(
          {             
            "_id": "60ff1954a0ad4104b6d6d81c"            
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': '60ff1954a0ad4104b6d6d81c' });
          done();
        });
    });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', done => {
      chai
        .request(server)
        .put('/api/issues/test_suite')
        .send(
          {             
            "_id": "111"            
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });

  test('Delete an issue: DELETE request to /api/issues/{project}', done => {
      chai
        .request(server)
        .delete('/api/issues/test_suite')
        .send(
          {             
            "_id": "60ff1954a0ad4104b6d6d81c"            
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
    });
    
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', done => {          
      chai
        .request(server)
        .delete('/api/issues/test_suite')
        .send(
          {             
            "_id": "111"            
          })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not delete');
          done();
        });
    });
    
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', done => {          
      chai
        .request(server)
        .delete('/api/issues/test_suite')
        .send({ })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

});
