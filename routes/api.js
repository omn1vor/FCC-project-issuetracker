'use strict';

const DB = require('../controllers/db.js');

module.exports = function (app) {

  let db = new DB;

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      db.getIssuesByProject(project, req.query, (err, data) => {
        if (err) return res.json(err);
        res.json(data);
      });

    })
    
    .post(function (req, res){
      let project = req.params.project;

      db.addIssue(project, req.body, (err, data) => {
        if (err) return res.json(err);
        res.json(data);
      });
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
      db.updateIssue(req.body._id, req.body, (err, data) => {        
        if (err) return res.json(err);        
        res.json(data);
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
            
      db.deleteIssue(project, req.body, (err, data) => {
        if (err) return res.json(err);
        res.json(data);
      })
    });
    
};
