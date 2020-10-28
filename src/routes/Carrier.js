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

//SQL Querries for Carrier table
const tableName = '[Carrier]'



//Get All Carriers
router.get('/GetAllCarriers', function (req, res, next) {
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
            console.log ("authentication failed");
        }
        
    });       
});



//Get All Carriers
router.get('/GetCarrierById', function (req, res, next) {
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
                request.query('select * from ' + tableName + " WHERE ID = " + req.query.carrier_id, function (err, recordset) {
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


//Get All Carriers
router.get('/GetCarriersSolutionsByRequestID', function (req, res, next) {
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
                let query ="select r.[id] as [request_id], s.[id] as [solution_id], cr.[id] as [carrier_id] \
                from [Request] as r \
                left join [Solution] as s on s.request_id = r.id \
                left join [Carrier] as cr on s.carrier_id = cr.id \
                where r.id = " + req.query.request_id

                request.query(query, function (err, recordset) {
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


//Add a new carrier
router.post('/AddCarrier', function (req, res) {
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
        
                let sqlQueryPost = "INSERT INTO [Carrier] ("
        
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
            console.log ("authentication failed");
        }            
    });
});

module.exports = router;
