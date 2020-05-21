var express = require('express');
var router = express.Router();
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

const tableName = '[Customer]'

//Get All Customer
router.get('/GetAllCustomers', function (req, res, next) {
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

//Get Customer by Company Name
router.get('/GetCustomerByName', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        
        var request = new sql.Request();

        const sqlQuery="select * from " + tableName + " WHERE name = '" + req.query.name +"'"
        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});


//Get Customer by Company Name
router.get('/GetCustomerByID', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        
        var request = new sql.Request();

        const sqlQuery="select * from " + tableName + " WHERE id = '" + req.query.id +"'"
        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
        });
    });
});

//Create new Customer 
router.post('/CreateCustomer', function (req, res) {
   
        sql.connect(dbconfig, function (err) {
            if (err) {
                console.log(err);
            }

            let sqlQueryPost = "INSERT INTO " + tableName +" ("

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
    
});


module.exports = router;
