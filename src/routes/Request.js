var express = require('express');
var router = express.Router();
var sql = require("mssql");
var dbconfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
};

//SQL Querries for REQUEST table
const tableName = '[Request]'

//Get Next Request
router.get('/GetRequests', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        if(req.query.assigned_user_id==='NULL')
            queryValue= 'select * from ' + tableName + ' where assigned_user_id is '
        else 
            queryValue='select * from ' + tableName + ' where assigned_user_id='

        request.query(queryValue + req.query.assigned_user_id, function (err, recordset) {
            if (err) {
                console.log(err)
                res.status(405);
                res.send(err)
            }
            res.send(recordset);
        });
    });
});

//Get Request by ID
router.get('/GetRequestDetails', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName + ' where id=' + req.query.id, function (err, recordset) {
            if (err) {
                console.log(err)
            }
        //    / res.send(JSON.stringify(recordset));
            res.send(recordset);
        });
    });
});

//Create new Request
router.post('/NewRequest', function (req, res) {
    const request = req.body;
    if (Object.keys(request).length != 18) {
        res.status(400)
        res.send('Request Failed - expected 18 fields, received ' + Object.keys(request).length);
    }
    else {
        sql.connect(dbconfig, function (err) {
            if (err) {
                console.log(err);
            }
            var sqlRequest = new sql.Request();
            if( request.assigned_user_id ==='NULL'){
                 sqlQuery = "INSERT INTO "+ tableName +" ( customer_id, from_address_city, from_address_postcode, to_address_city, to_address_postcode, load_datetime, \
                    unload_datetime, solution_time, validation_datetime, goods_weight, goods_europallets, truck_type_id, adr_type_id, special_requirments, \
                    email_html, assigned_user_id, completed, request_status_type_id, datetime_created, datetime_modified) OUTPUT SCOPE_IDENTITY()  VALUES ('" +
                    request.customer_id + "','" +
                    request.from_address_city + "','" +
                    request.from_address_postcode + "','" +
                    request.to_address_city + "','" +
                    request.to_address_postcode + "','" +
                    request.load_datetime + "','" +
                    request.unload_datetime + "','" +
                    request.solution_time + "','" +
                    request.validation_datetime + "','" +
                    request.goods_weight + "','" +
                    request.goods_europallets + "','" +
                    request.truck_type_id + "','" +
                    request.adr_type_id + "','" +
                    request.special_requirments + "','" +
                    request.email_html + "', NULL, '" +
                    request.completed + "','" +
                    request.request_status_type_id + "',GETDATE(), GETDATE()) SELECT SCOPE_IDENTITY() as id ";
            }else{
             sqlQuery = "INSERT INTO "+ tableName +" ( customer_id, from_address_city, from_address_postcode, to_address_city, to_address_postcode, load_datetime, \
                unload_datetime, solution_time, validation_datetime, goods_weight, goods_europallets, truck_type_id, adr_type_id, special_requirments, \
                email_html, assigned_user_id, completed, request_status_type_id, datetime_created, datetime_modified) OUTPUT SCOPE_IDENTITY()  VALUES ('" +
                request.customer_id + "','" +
                request.from_address_city + "','" +
                request.from_address_postcode + "','" +
                request.to_address_city + "','" +
                request.to_address_postcode + "','" +
                request.load_datetime + "','" +
                request.unload_datetime + "','" +
                request.solution_time + "','" +
                request.validation_datetime + "','" +
                request.goods_weight + "','" +
                request.goods_europallets + "','" +
                request.truck_type_id + "','" +
                request.adr_type_id + "','" +
                request.special_requirments + "','" +
                request.email_html + "','" +
                request.assigned_user_id + "','" +
                request.completed + "','" +
                request.request_status_type_id + "',GETDATE(), GETDATE()) SELECT SCOPE_IDENTITY() as id";
            } 
            console.log(sqlQuery)
            sqlRequest.query(sqlQuery, function (err, recordset) {
                if (err) {
                    res.status(400)
                    res.send(err);
                    console.log(err)
                } else {
                    res.status(200)
                    res.send(recordset)
                }
            });
        });
    }
});

//Update Request by ID
router.put('/UpdateRequest', function (req, res) {
    const request = req.body;
    if (Object.keys(request).length != 18) {
        res.status(400)
        res.send('Request Failed - expected 18 fields, received ' + Object.keys(request).length);
    }
    else {
        sql.connect(dbconfig, function (err) {
            if (err) {
                console.log(err);
            }
            var sqlRequest = new sql.Request();
            const sqlQuery = "UPDATE " + tableName + " SET \
            customer_id = '" + request.customer_id + "' ,  \
            from_address_city = '" + request.from_address_city + "' , \
            from_address_postcode = '" + request.from_address_postcode + "' , \
            to_address_city = '" + request.to_address_city + "' ,\
            to_address_postcode = '" + request.to_address_postcode + "' ,\
            load_datetime = '" + request.load_datetime + "' ,\
            unload_datetime = '" + request.unload_datetime + "' , \
            solution_time = '" + request.solution_time + "' ,\
            validation_datetime = '" + request.validation_datetime + "' , \
            goods_weight = '" + request.goods_weight + "', \
            goods_europallets = '" + request.goods_europallets + "', \
            truck_type_id = '" + request.truck_type_id + "' , \
            adr_type_id = '" + request.adr_type_id + "' , \
            special_requirments = '" + request.special_requirments + "' , \
            email_html = '" + request.email_html + "' , \
            assigned_user_id = '" + request.assigned_user_id + "' , \
            completed = '" + request.completed + "' , \
            request_status_type_id = '" + request.request_status_type_id + "' , \
            datetime_modified = GETDATE() \
             WHERE id = " + req.query.id;

            sqlRequest.query(sqlQuery, function (err, recordset) {
                if (err) {
                    res.status(400)
                    res.send(err);
                    console.log(err)
                } else {
                    res.status(200)
                    res.send('updated')
                // /    res.send('inserting data in SQL table ' + tableName);
                }
            });
        });
    }
});

module.exports = router;
