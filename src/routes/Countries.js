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

const tableName = '[Country]'

//Get All Customer
router.get('/GetAllCountries', function (req, res, next) {

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




module.exports = router;
