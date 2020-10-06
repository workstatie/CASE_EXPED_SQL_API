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

const tableName = '[Client]'

//These are our Clients

//Get All Clients
router.get('/GetAllClients', function (req, res, next) {
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
                request.query('select * from ' + tableName , function (err, recordset) {
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
              console.log ("authentication failed GetAllCustomers");
          }
          
      });
    
});

router.get('/GetAllRoles', function (req, res, next) {
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
              request.query('select * from [Role]', function (err, recordset) {
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
            console.log ("authentication failed GetAllCustomers");
        }      
    });
});


//Get Customer by Company Name
router.get('/GetClientByID', function (req, res, next) {
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
        
                const sqlQuery="select * from " +tableName + " WHERE customer_id = '" + req.query.customer_id +"'"
                request.query(sqlQuery, function (err, recordset) {
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
              console.log ("authentication failed GetCustomerByID");
          }
          
      });
    
});


//Create new Client 
router.post('/CreateClient', function (req, res) {
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
    
                let sqlQueryPost = "INSERT INTO " + tableName +" ("
    
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    sqlQueryPost = sqlQueryPost + Object.keys(req.body)[i] + ",";
                }
    
                sqlQueryPost= sqlQueryPost + "  datetime_created, datetime_modified)  OUTPUT SCOPE_IDENTITY()  VALUES ( '"
    
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    sqlQueryPost = sqlQueryPost+ Object.values(req.body)[i] + "','"
                }
                sqlQueryPost = sqlQueryPost.slice(0, sqlQueryPost.length - 2) + ", GETDATE(), GETDATE()) SELECT SCOPE_IDENTITY() as id";
                
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
             console.log ("authentication failed CreateCustomer");
         }
         
     });
        
    
});




module.exports = router;
