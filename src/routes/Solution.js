var express = require('express');
var router = express.Router();
var sql = require("mssql");
let securityObj = require('../okta_auth/oktaAuth.js');
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

//SQL Querries for Solution table
const tableName = '[Solution]'

//Get All Solution
router.get('/GetSolutions', function (req, res, next) {
      //Check Auth
      var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                var request = new sql.Request();
                request.query('select * from ' + tableName, function (err, recordset) {
                    if (err) {
                        console.log(err)
                    }
                    res.send(recordset);
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetSolutions");
          }
          
      });
    
});

//Get Solution by ID
router.get('/GetSolutionByID', function (req, res, next) {
      //Check Auth
      var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                var request = new sql.Request();
                let query ="select s.*, cr.[email] as [carrier_email] \
                from [Solution] as s \
                left join [Carrier] as cr on s.carrier_id = cr.id \
                where s.id = "
        
                request.query(query + req.query.id, function (err, recordset) {
                    if (err) {
                        console.log(err)
                    }
                    res.send(recordset);
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetSolutionByID");
          }
          
      });
    
});

//Get Solution by ID
router.get('/GetSolutionForRequestID', function (req, res, next) {
      //Check Auth
      var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                var request = new sql.Request();
        
                let query ="select s.*, cr.[email] as [carrier_email] \
                from [Solution] as s \
                left join [Carrier] as cr on s.carrier_id = cr.id \
                where s.request_id = "
                request.query(query + req.query.request_id, function (err, recordset) {
                    if (err) {
                        console.log(err)
                    }
                    res.send(recordset);
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetSolutionForRequestID");
          }
          
      });
    
});

//Get Solution by ID
router.get('/GetConfirmedSolutionForRequestID', function (req, res, next) {
      //Check Auth
      var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                var request = new sql.Request();
        
                let query ="select s.*, cr.[email] as [carrier_email] \
                from [Solution] as s \
                left join [Carrier] as cr on s.carrier_id = cr.id \
                where s.solution_status = 2 and s.request_id = "
                request.query(query + req.query.request_id, function (err, recordset) {
                    if (err) {
                        console.log(err)
                    }
                    res.send(recordset);
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetConfirmedSolutionForRequestID");
          }
          
      });
    
});


//Add a new solution
router.post('/AddSolution', function (req, res) {
      //Check Auth
    
      var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              const request = req.body;

              sql.connect(dbconfig, function (err) {
                  if (err) {
                      console.log(err);
                  }
          
                  let sqlQueryPost = "INSERT INTO " + tableName + " ("
          
                  for (var i = 0; i < Object.keys(req.body).length; i++) {
                      sqlQueryPost = sqlQueryPost + Object.keys(req.body)[i] + ",";
                  }
          
                  sqlQueryPost = sqlQueryPost + "  datetime_created, datetime_modified)  OUTPUT SCOPE_IDENTITY()  VALUES ( '"
                  for (var i = 0; i < Object.keys(req.body).length; i++) {
                      sqlQueryPost = sqlQueryPost + Object.values(req.body)[i] + "','"
                  }
                  sqlQueryPost = sqlQueryPost.slice(0, sqlQueryPost.length - 2) + ", GETDATE(), GETDATE()) SELECT SCOPE_IDENTITY() as id";
                  console.log(sqlQueryPost)
          
                  var sqlRequest = new sql.Request();
          
                  sqlRequest.query(sqlQueryPost, function (err, recordset) {
                      if (err) {
                          res.status(400)
                          res.send(err);
                          console.log(err)
                      } else {
                          res.status(200)
                          res.send(recordset);
                      }
                  });
              });
          
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed AddSolution");
          }
          
      });
    
});


//Update Solution by ID
router.patch('/UpdateSolution', function (req, res) {
      //Check Auth
      var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                let sqlQueryPatch = "UPDATE [Solution] SET "
        
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    sqlQueryPatch = sqlQueryPatch + Object.keys(req.body)[i] + " = '" + Object.values(req.body)[i] + "',"
                }
                sqlQueryPatch = sqlQueryPatch.slice(0, sqlQueryPatch.length - 1) + " WHERE ID = " + req.query.id;
                console.log(sqlQueryPatch)
                var sqlRequest = new sql.Request();
        
                sqlRequest.query(sqlQueryPatch, function (err, recordset) {
                    if (err) {
                        res.status(400)
                        res.send(err);
                        console.log(err)
                    } else {
                        res.status(200)
                        res.send('updated')
                    }
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed UpdateSolution");
          }
          
      });

    
});

module.exports = router;
