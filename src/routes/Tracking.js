var express = require('express');
var router = express.Router();
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

//SQL Querries for Tracking table
tableName = 'Tracking'

//Get GetTrackingInfo by ID
router.get('/GetTrackingInfo', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName + ' where id=' + req.query.id, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(JSON.stringify(recordset));
        });
    });
});

//Create new Tracking 
router.post('/AddTrackingInfo', function (req, res) {
    const request = req.body;
    if (Object.keys(request).length != 5) {
        res.status(400)
        res.send('Request Failed - expected 5 fields, received ' + Object.keys(request).length);
    }
    else {
        sql.connect(dbconfig, function (err) {
            if (err) {
                console.log(err);
            }
            var sqlRequest = new sql.Request();
            const sqlQuery = "INSERT INTO "+ tableName +" (request_id, carrier_id, driver_contact_phone, completed, warnings, datetime_created, datetime_modified) VALUES ('" +
                request.request_id + "','" +
                request.carrier_id + "','" +
                request.driver_contact_phone + "','" +
                request.completed + "','" +
                request.warnings + "',GETDATE(), GETDATE()) ";
            sqlRequest.query(sqlQuery, function (err, recordset) {
                if (err) {
                    res.status(400)
                    res.send(err);
                    console.log(err)
                } else {
                    res.status(200)
                    res.send('inserting data in SQL table ' + tableName);
                }
            });
        });
    }
});


module.exports = router;
