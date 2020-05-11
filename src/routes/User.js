var express = require('express');
var router = express.Router();
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

//SQL Querries for User table
const tableName = '[User]'

//Get User by ID
router.get('/GetUserInfo', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName + ' where id= ' + req.query.id, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});


//Get User by email
router.get('/GetUserByEmail', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        
        request.query("select ID, username, email, phone from " + tableName + " where email='" + req.query.email + "'", function (err, recordset) {
            if (err) {
                res.send(err)
            }
            res.send(recordset);
        });
    });
});

//Login User
router.get('/LoginUser', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        sqlQuery= "Select username from User where LOWER(username) = LOWER(" +req.query.username + ") and password_hash = " + req.query.passHash;
        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(JSON.stringify(recordset));
        });
    });
});


module.exports = router;
