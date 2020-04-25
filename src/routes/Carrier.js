var express = require('express');
var router = express.Router();
var sql = require("mssql");
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

//Add a new carrier
router.post('/AddCarrier', function (req, res) {
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
            const sqlQuery = "INSERT INTO "+ tableName +" (name, phone, email, orders_fulfilled, rating, datetime_created, datetime_modified) VALUES ('" +
                request.name + "','" +
                request.phone + "','" +
                request.email + "','" +
                request.orders_fulfilled + "','" +
                request.rating + "',GETDATE(), GETDATE()) ";
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
