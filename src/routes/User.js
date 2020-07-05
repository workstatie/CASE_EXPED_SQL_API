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

//SQL Querries for User table
const tableName = '[User]'
const tableNameLogs = '[Log]'

//Get User by ID
router.get('/GetUserInfo', function (req, res, next) {
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
                request.query('select * from ' + tableName + ' where id= ' + req.query.id, function (err, recordset) {
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
              console.log ("authentication failed");
          }
          
      });
    
});


//Get User by email
router.get('/GetUserByEmail', function (req, res, next) {
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
                
                request.query("select ID, username, email, phone from " + tableName + " where email='" + req.query.email + "'", function (err, recordset) {
                    if (err) {
                        res.send(err)
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
              console.log ("authentication failed");
          }          
      });    
});

//Login User
router.get('/LoginUser', function (req, res, next) {
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
                sqlQuery= "Select username from User where LOWER(username) = LOWER(" +req.query.username + ") and password_hash = " + req.query.passHash;
                request.query(sqlQuery, function (err, recordset) {
                    if (err) {
                        console.log(err)
                    }
                    res.send(JSON.stringify(recordset));
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed");
          }
          
      });
    
});



//Create new LogEvent 
router.post('/AddLog', function (req, res) {
    //Check Auth
    var authStatus = securityObj.checkSecurity(req.query.api_key,function(result)
    {
        if (result==="567" || result.includes("@"))
        {
            //key is good
            const request = req.body;
            console.log(request)
            sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
        
                let sqlQueryPost = "INSERT INTO " + tableNameLogs +" ("
        
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    sqlQueryPost = sqlQueryPost + Object.keys(req.body)[i] + ",";
                }
        
                sqlQueryPost= sqlQueryPost + "  datetime_created)  OUTPUT SCOPE_IDENTITY()  VALUES ( '"
        
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    sqlQueryPost = sqlQueryPost+ Object.values(req.body)[i] + "','"
                }
                sqlQueryPost = sqlQueryPost.slice(0, sqlQueryPost.length - 2) + ", GETDATE()) SELECT SCOPE_IDENTITY() as id";
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
            console.log ("authentication failed");
        }        
    });
});

//Get Newest Carrier Log 
router.get('/GetNewestCarrierLog', function (req, res, next) {
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
              
              request.query("select top 1 * from " + tableNameLogs + " where [log_type_id] = 1 AND [related_entity_id] ='" + req.query.carrier_id + "' order by datetime_created desc", function (err, recordset) {
                  if (err) {
                      res.send(err)
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
            console.log ("authentication failed");
        }          
    });    
});



module.exports = router;
