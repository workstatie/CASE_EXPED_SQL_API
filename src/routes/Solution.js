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


//Get All Solution
router.get('/GetConfirmedSolutions', function (req, res, next) {
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
              request.query('select * from ' + tableName + ' where solution_status = 2', function (err, recordset) {
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
        
                let query ="select s.*, cr.[email] as [carrier_email], sl.[status] as [solution_status_name] \
                from [Solution] as s \
                left join [Carrier] as cr on s.carrier_id = cr.id \
                left join [Solution_Status] as sl on s.solution_status = sl.id \
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
                  let sqlQueryPost = "INSERT INTO " + tableName + " ("
                  
                  for (var i = 0; i < Object.keys(req.body).length; i++) {
                      sqlQueryPost = sqlQueryPost + Object.keys(req.body)[i] + ",";
                  }
          
                  sqlQueryPost = sqlQueryPost + "  datetime_created, datetime_modified)  OUTPUT SCOPE_IDENTITY()  VALUES ( '"
                  for (var i = 0; i < Object.keys(req.body).length; i++) {
                      sqlQueryPost = sqlQueryPost + Object.values(req.body)[i] + "','"
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
              console.log ("authentication failed AddSolution");
          }
          
      });
    
});


//Update Solution by ID
router.patch('/UpdateSolution', function (req, res) {
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

                let sqlQueryPatch = "UPDATE [Solution] SET "
        
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    console.log(req.body)
                    if(Object.values(req.body)[i].length>0)
                    {
                        sqlQueryPatch = sqlQueryPatch + Object.keys(req.body)[i] +" = '" +Object.values(req.body)[i] + "',"

                    }
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
                        res.send(recordset)
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



router.get('/GetAvailableSolutions', function (req, res, next) {
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
              request.query("select r.*, s.[id] as [solution_id], s.[price] as [solution_price], s.[details] as [solution_details], cust.[email] as [customer_email]\
              from [Request] as r  \
              left join [Solution] as s on r.id = s.request_id \
              left join [Customer_Contact] as cust on r.customer_contact_id = cust.id \
              where r.request_status_type_id ='5' and s.solution_status ='3' \
              and r.load_datetime >= GETDATE() ORDER BY r.load_datetime ASC", function (err, recordset){
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
                  res.status(200)
                  res.send(recordset);
              });
          });
        }
        else 
        {
            //key not good
            res.status(401);
            res.send("authentication failed!");
            console.log ("authentication failed GetRequestByCountry");
        }
        
    });
  
});



router.get('/GetAvailableSolutionsByStatus', function (req, res, next) {
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
              request.query("select r.*,\
              s.[id] as [solution_id], s.[solution_status] as [solution_status], s.[email_response] as [email_response_carrier], s.[email_client_response] as [email_client_response],\
              s.[price] as [price_for_client], s.[details] as [solution_details], \
              cust.[email] as [customer_email],\
              carrier.[email] as [carrier_email]\
              from [Request] as r  \
              left join [Solution] as s on r.id = s.request_id \
              left join [Customer_Contact] as cust on r.customer_contact_id = cust.id \
              left join [Carrier] as carrier on s.carrier_id = carrier.id \
              where s.solution_status ='"+req.query.status_id + "' \
              and r.load_datetime >= GETDATE() ORDER BY r.load_datetime ASC", function (err, recordset){
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
                  res.status(200)
                  res.send(recordset);
              });
          });
        }
        else 
        {
            //key not good
            res.status(401);
            res.send("authentication failed!");
            console.log ("authentication failed GetRequestByCountry");
        }
    });
});







module.exports = router;
