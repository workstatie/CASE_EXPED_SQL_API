var express = require('express');
var router = express.Router();
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

//SQL Querries for CSAT table
tableName = 'CSAT';

//Create new CSAT
router.post('/AddCSAT', function (req, res) {
    const request = req.body;
    if (Object.keys(request).length != 4) {
        res.status(400)
        res.send('Request Failed - expected 4 fields, received ' + Object.keys(request).length);
    }
    else {
        sql.connect(dbconfig, function (err) {
            if (err) {
                console.log(err);
            }
            var sqlRequest = new sql.Request();
            const sqlQuery = "INSERT INTO "+ tableName +" (customer_id, score, request_id, feedback, datetime_created, datetime_modified) VALUES ('" +
                request.customer_id + "','" +
                request.score + "','" +
                request.request_id + "','" +
                request.feedback + "',GETDATE(), GETDATE()) ";
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
