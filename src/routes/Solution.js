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
        request.query('select * from ' + tableName, function (err, recordset) {
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
        console.log(sqlQueryPost)

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

});

module.exports = router;
