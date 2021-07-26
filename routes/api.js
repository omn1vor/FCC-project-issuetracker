'use strict';

const DB = require('../controllers/db.js');

module.exports = function (app) {

  let db = new DB;

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      db.getIssuesByProject(project, req.query, (err, data) => {
        res.json(data);
      });

    })
    
    .post(function (req, res){
      let project = req.params.project;

      if (!db.checkInput(req.body)) {        
        return res.json({ error: 'required field(s) missing' });
      }

      db.addIssue(project, req.body, (err, data) => {
        res.json(data);
      });
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
      if (!req.body._id) {
        //console.log('missing id');
        return res.json({ error: 'missing _id' });
      }

      db.updateIssue(req.body._id, req.body, (err, data) => {        
        if (err) return res.json(err);
        //console.log('ive updated', err, data);
        res.json(data);
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
      if (!req.body._id) {
        return res.json({ error: 'missing _id' });
      }
      db.deleteIssue(project, req.body._id, (err, data) => {
        if (err) return res.json(err);
        res.json({ result: 'successfully deleted', '_id': req.body._id });
      })
    });
    
};
