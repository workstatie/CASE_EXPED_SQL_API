var express = require('express');
var router = express.Router();
let securityObj = require('../okta_auth/oktaAuth.js');
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

//SQL Querries for REQUEST table
const tableName = '[Request]'

//Get Next Request
router.get('/GetRequests', function (req, res, next) {
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
                queryValue = "select r.*, rst.[name] as [status_name], rs.[name] as [source_name], tt.[name] as [truck_type_name] \
                from [Request] as r  \
                left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
                left join [Request_Sources] as rs on r.request_source_id = rs.id \
                left join [Truck_Type] as tt on r.truck_type_id = tt.id \
                where assigned_user_id =" 
        
                request.query(queryValue + req.query.assigned_user_id, function (err, recordset) {
                    if (err) {
                        console.log(err)
                        res.status(405);
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
              console.log ("authentication failed GetRequests");
          }
          
      });
    
});

//Get Next Request
router.get('/GetUnassignedRequests', function (req, res, next) {
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
                queryValue = "select r.*, rst.[name] as [status_name], rs.[name] as [source_name], tt.[name] as [truck_type_name], cust.[name] as [customer_name]\
                from [Request] as r  \
                left join [Customer] as cust on r.customer_id = cust.id \
                left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
                left join [Request_Sources] as rs on r.request_source_id = rs.id \
                left join [Truck_Type] as tt on r.truck_type_id = tt.id \
                where assigned_user_id is NULL and request_source_id='1'"
                
                request.query(queryValue, function (err, recordset) {
                    if (err) {
                        console.log(err)
                        res.status(405);
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
              console.log ("authentication failed GetUnassignedRequests");
          }
          
      });
    
});




//Get Next Request
router.get('/GetRequestsByStatusId', function (req, res, next) {
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
                queryValue = 'select * from ' + tableName + ' where request_status_type_id ='    
                request.query(queryValue + req.query.request_status_type_id, function (err, recordset) {
                    if (err) {
                        console.log(err)
                        res.status(405);
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
              console.log ("authentication failed GetRequestsByStatusId");
          }
          
      });
   
});



router.get('/GetAllRequests', function (req, res, next) {
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
                    //    / res.send(JSON.stringify(recordset));
                    res.send(recordset);
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetAllRequests");
          }
          
      });
    
});


//Get Current Requests
router.get('/GetActiveRequests', function (req, res, next) {


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

              queryActive= 'select r.*, tt.[name] as [truck_type_name]\
              from [Request] as r  \
              left join [Truck_Type] as tt on r.truck_type_id = tt.id \
              where load_datetime >= GETDATE() and request_status_type_id =2';

              request.query(queryActive, function (err, recordset) {
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
                  res.send(recordset);
              });
          });
        }
        else 
        {
            //key not good
            res.status(401);
            res.send("authentication failed!");
            console.log ("authentication failed GetAllRequests");
        }
        
    });
});


router.get('/GetActiveRequestsByReqStatus', function (req, res, next) {

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

              queryActive= 'select r.*, tt.[name] as [truck_type_name]\
              from [Request] as r  \
              left join [Truck_Type] as tt on r.truck_type_id = tt.id \
              where load_datetime >= GETDATE() and request_status_type_id ='+ req.query.request_status_type_id;

              request.query(queryActive, function (err, recordset) {
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
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


//Get Active Request by User
router.get('/GetActiveRequestsByUser', function (req, res, next) {
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
              
              queryActive= 'Select * from Request where load_datetime >= GETDATE() and request_status_type_id =2 and assigned_user_id=' + req.query.user_id

              request.query(queryActive, function (err, recordset) {
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
                  res.send(recordset);
              });
          });
        }
        else 
        {
            //key not good
            res.status(401);
            res.send("authentication failed!");
            console.log ("authentication failed GetAllRequests");
        }
    });
});


router.get('/CheckTransporeonDuplicate', function (req, res, next) {
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
              var sqlQuery="select * from " + tableName + " where request_source_id = 3 and from_address_postcode='" + req.query.from_address_postcode +
              "' and to_address_postcode = '" +req.query.to_address_postcode +
              "' and load_datetime = '" +req.query.load_datetime +
              "'and unload_datetime = '" +req.query.unload_datetime  +"'"

              request.query(sqlQuery , function (err, recordset){
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
                  res.send(recordset);
              });
          }); 
        }
        else 
        {
            //key not good
            res.status(401);
            res.send("authentication failed!");
            console.log ("authentication failed GetRequestByTransporeonID");
        }
        
    });
  
});

router.get('/GetRequestByTransporeonID', function (req, res, next) {
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
                request.query('select * from ' + tableName + ' where transporeon_id=' + req.query.transporeon_id, function (err, recordset){
                    if (err) {
                        console.log(err)
                    }
                    //    / res.send(JSON.stringify(recordset));
                    res.send(recordset);
                });
            }); 
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetRequestByTransporeonID");
          }
          
      });
    
});


router.get('/GetRequestByCountry', function (req, res, next) {
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
                request.query('select r.*, rst.[name] as [status_name], rs.[name] as [source_name] \
                from [Request] as r  \
                left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
                left join [Request_Sources] as rs on r.request_source_id = rs.id \
                where from_address_country in (select name from country where id in (select country_id from user_filters where user_id = '+req.query.user_id +'))  \
                and rst.id NOT IN (9, 7) and r.load_datetime >= GETDATE() ORDER BY r.load_datetime ASC', function (err, recordset){
                    if (err) {
                        console.log(err)
                    }
                    //    / res.send(JSON.stringify(recordset));
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



router.get('/GetActiveRequestByClientId', function (req, res, next) {
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
              request.query('select r.*, rst.[name] as [status_name], rs.[name] as [source_name], u.[email] as [created_by] \
              from [Request] as r  \
              left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
              left join [Request_Sources] as rs on r.request_source_id = rs.id \
              left join [User] as u on r.assigned_user_id = u.id \
              where assigned_user_id in (select user_id from Client_Users where client_id = '+req.query.client_id +')  \
              and rst.id NOT IN (9, 7) and r.load_datetime >= GETDATE() ORDER BY r.load_datetime ASC', function (err, recordset){
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
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








router.get('/GetActiveRequestsByUserID', function (req, res, next) {
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
              var q="select r.*, rst.[name] as [status_name], rs.[name] as [source_name] \
              from [Request] as r  \
              left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
              left join [Request_Sources] as rs on r.request_source_id = rs.id \
              where assigned_user_id='"+req.query.user_id +"' \
              and rst.id NOT IN (9, 7) and r.load_datetime >= GETDATE() ORDER BY r.load_datetime ASC";

              request.query(q, function (err, recordset){
                  if (err) {
                      console.log(err)
                  }
                  //    / res.send(JSON.stringify(recordset));
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



//Get Request by ID
router.get('/GetRequestDetails', function (req, res, next) {
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
                var query = "select r.*, rst.[name] as [status_name]\
                from [Request] as r  \
                left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
                where r.id='"+ req.query.id +"'";

                request.query(query, function (err, recordset) {
                    if (err) {
                        console.log(err)
                    }
                    //    / res.send(JSON.stringify(recordset));
                    res.send(recordset);
                });
            });
          }
          else 
          {
              //key not good
              res.status(401);
              res.send("authentication failed!");
              console.log ("authentication failed GetRequestDetails");
          }
          
      });
    
});

//Create new Request
router.post('/NewRequest', function (req, res) {
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
              console.log ("authentication failed NewRequest");
          }
          
      });
   
});

//Update Request by ID
router.put('/UpdateRequest', function (req, res) {
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
                let sqlQueryPut = "UPDATE [Request] SET "
        
                for (var i = 0; i < Object.keys(req.body).length; i++) {

                    if(Object.values(req.body)[i].length>0)
                    {
                        sqlQueryPut = sqlQueryPut + Object.keys(req.body)[i] +" = '" +Object.values(req.body)[i] + "',"

                    }
                }
                sqlQueryPut = sqlQueryPut.slice(0, sqlQueryPut.length - 1) + " WHERE ID = " + req.query.id;
                var sqlRequest = new sql.Request();
        
                sqlRequest.query(sqlQueryPut, function (err, recordset) {
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
              console.log ("authentication failed UpdateRequest");
          }
          
      });

   
});


router.patch('/UpdateRequest', function (req, res) {
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
                let sqlQueryPatch = "UPDATE [Request] SET "
        
                for (var i = 0; i < Object.keys(req.body).length; i++) {
                    sqlQueryPatch = sqlQueryPatch + Object.keys(req.body)[i] + " = '" + Object.values(req.body)[i] + "',"
                }
                sqlQueryPatch = sqlQueryPatch.slice(0, sqlQueryPatch.length - 1) + " WHERE id = " + req.query.id;
         
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
              console.log ("authentication failed UpdateRequest");
          }
          
      });

    
});



module.exports = router;
