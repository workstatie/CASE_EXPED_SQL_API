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
      var authStatus = securityObj.checkSecurity(req.token,function(result)
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

          }
          
      });
    
});


//Get User by email
router.get('/GetUserByEmail', function (req, res, next) {
      //Check Auth
      var authStatus = securityObj.checkSecurity(req.token,function(result)
      {
          if (result==="567" || result.includes("@"))
          {
              //key is good
              sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                var request = new sql.Request();
                const getUSerQ="select u.*, c.[client_name] as [client], c.[id] as [client_id], r.[role_name] as [role]\
                from [User] as u \
                left join [Client_Users] as clu on u.id = clu.user_id \
                left join [Client] as c on clu.client_id = c.id \
                left join [User_Roles] as ur on u.id = ur.user_id \
                left join [Role] as r on ur.role_id = r.id \
                where email='" + req.query.email + "'";

                request.query(getUSerQ , function (err, recordset) {
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



router.post('/AddUser', function (req, res) {
    //Check Auth
    var authStatus = securityObj.checkSecurity(req.token,function(result)
    {
        if (result==="567" || result.includes("@"))
        {
            //key is good
            const request = req.body;

            sql.connect(dbconfig, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log(req.body)
                let sqlQueryPostNewUser = "INSERT INTO [User] (username, email, phone, firstname, lastname, datetime_created, datetime_modified) OUTPUT SCOPE_IDENTITY() \
                VALUES ('" + req.body.email + "','" + req.body.email + "','" + req.body.phone + "',\
                 '"+ req.body.firstname + "','" + req.body.lastname + "', GETDATE(), GETDATE()) SELECT SCOPE_IDENTITY() as id";
        
                var sqlRequest = new sql.Request();
        
                sqlRequest.query(sqlQueryPostNewUser, function (err, recordset) {
                    if (err) {
                        res.status(400)
                        res.send(err);
                        console.log(err)
                    } else {
                        userId = recordset.recordsets[1][0].id;                     
                        console.log(userId)
                        let sqlQueryAddRole = " INSERT INTO [USER_ROLES] (user_id, role_id) VALUES ('" + userId + "','" +  req.body.role_id + "')";

                        console.log('===============')
                        console.log(sqlQueryAddRole)
                        sqlRequest.query(sqlQueryAddRole, function (err, recordset) {
                            if (err) {
                                res.status(400)
                                res.send(err);
                                console.log(err)
                            } else {
                               console.log('added Role to user ' +userId)
                            }
                        });

                        let sqlQueryAddToClient = " INSERT INTO [Client_Users] (user_id, client_id) VALUES ('" + userId + "','" +  req.body.client_id + "')";
                        sqlRequest.query(sqlQueryAddToClient, function (err, recordset) {
                            if (err) {
                                res.status(400)
                                res.send(err);
                                console.log(err)
                            } else {
                                res.status(200)      
                                console.log('added to Company user ' +userId)                 
                                res.send(recordset);
                            }
                        });
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




//Update User by ID
router.patch('/UpdateUser', function (req, res) {
    //Check Auth
    var authStatus = securityObj.checkSecurity(req.token,function(result)
    {
        if (result==="567" || result.includes("@"))
        {
            //key is good
            sql.connect(dbconfig, function (err) {
              if (err) {
                  console.log(err);
              }
              let sqlQueryPatch = "UPDATE [User] SET "
      
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

//Create new LogEvent 
router.post('/AddLog', function (req, res) {
    //Check Auth
    var authStatus = securityObj.checkSecurity(req.token,function(result)
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
    var authStatus = securityObj.checkSecurity(req.token,function(result)
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
        }          
    });    
});



module.exports = router;
