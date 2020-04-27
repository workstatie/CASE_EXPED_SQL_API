var express = require('express');
var router = express.Router();
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};


//Get All Request Status Types
router.get('/GetStatusTypes', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from Request_Status_Type', function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});


//Get All Request Status Types
router.get('/GetAllTruckTypes', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from Truck_Type', function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});


module.exports = router;