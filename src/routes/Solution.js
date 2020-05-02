var express = require('express');
var router = express.Router();
var sql = require("mssql");
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
});

//Get Solution by ID
router.get('/GetSolutionByID', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName + ' where id=' + req.query.id, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});

//Get Solution by ID
router.get('/GetSolutionForRequestID', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName + ' where request_id=' + req.query.request_id, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});


//Add a new solution
router.post('/AddSolution', function (req, res) {
    const request = req.body;
    if (Object.keys(request).length != 7) {
        res.status(400)
        res.send('Request Failed - expected 7 fields, received ' + Object.keys(request).length);
    }
    else {
        sql.connect(dbconfig, function (err) {
            if (err) {
                console.log(err);
            }
            var sqlRequest = new sql.Request();
            const sqlQuery = "INSERT INTO "+ tableName +" (request_id, price, delay, carrier_id, truck_type_id, details, transit_time, datetime_created, datetime_modified) VALUES ('" +
                request.request_id + "','" +
                request.price + "','" +
                request.delay + "','" +
                request.carrier_id + "','" +
                request.truck_type_id + "','" +
                request.details + "','" +
                request.transit_time + "',GETDATE(), GETDATE()) ";
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
