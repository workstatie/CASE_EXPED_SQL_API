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
        queryValue = "select r.*, rst.[name] as [status_name], rs.[name] as [source_name], tt.[name] as [truck_type_name] \
        from [Request] as r  \
        left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
        left join [Request_Sources] as rs on r.request_source_id = rs.id \
        left join [Truck_Type] as tt on r.truck_type_id = tt.id \
        where assigned_user_id =" 

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

//Get Next Request
router.get('/GetUnassignedRequests', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        queryValue = "select r.*, rst.[name] as [status_name], rs.[name] as [source_name], tt.[name] as [truck_type_name], cust.[name] as [customer_name]\
        from [Request] as r  \
        left join [Customer] as cust on r.customer_id = cust.id \
        left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
        left join [Request_Sources] as rs on r.request_source_id = rs.id \
        left join [Truck_Type] as tt on r.truck_type_id = tt.id \
        where assigned_user_id is NULL and request_source_id='1'"
        
        request.query(queryValue, function (err, recordset) {
            if (err) {
                console.log(err)
                res.status(405);
                res.send(err)
            }
            res.send(recordset);
        });
    });
});


//Get Next Request
router.get('/GetRequestsByStatusId', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        queryValue = 'select * from ' + tableName + ' where request_status_type_id ='    
        request.query(queryValue + req.query.request_status_type_id, function (err, recordset) {
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
router.get('/GetAllRequests', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            //    / res.send(JSON.stringify(recordset));
            res.send(recordset);
        });
    });
});

router.get('/GetRequestByTransporeonID', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select * from ' + tableName + ' where transporeon_id=' + req.query.transporeon_id, function (err, recordset){
            if (err) {
                console.log(err)
            }
            //    / res.send(JSON.stringify(recordset));
            res.send(recordset);
        });
    });
});

router.get('/GetRequestByCountry', function (req, res, next) {
    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        var request = new sql.Request();
        request.query('select r.*, rst.[name] as [status_name], rs.[name] as [source_name] \
        from [Request] as r  \
        left join [Request_Status_Type] as rst on r.request_status_type_id = rst.id \
        left join [Request_Sources] as rs on r.request_source_id = rs.id \
        where from_address_country in (select name from country where id in (select country_id from user_filters where user_id = '+req.query.user_id +'))', function (err, recordset){
            if (err) {
                console.log(err)
            }
            //    / res.send(JSON.stringify(recordset));
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
        console.log(sqlQueryPost);

        sqlRequest.query(sqlQueryPost, function (err, recordset) {
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
});

//Update Request by ID
router.put('/UpdateRequest', function (req, res) {

    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        let sqlQueryPut = "UPDATE [Request] SET "

        for (var i = 0; i < Object.keys(req.body).length; i++) {
            sqlQueryPut = sqlQueryPut + Object.keys(req.body)[i] + " = '" + Object.values(req.body)[i] + "',"
        }
        sqlQueryPut = sqlQueryPut.slice(0, sqlQueryPut.length - 1) + " WHERE ID = " + req.query.id;
        console.log(sqlQueryPut)
        var sqlRequest = new sql.Request();

        sqlRequest.query(sqlQueryPut, function (err, recordset) {
            if (err) {
                res.status(400)
                res.send(err);
                console.log(err)
            } else {
                res.status(200)
                res.send('updated')
            }
        });
    });
});


router.patch('/UpdateRequest', function (req, res) {

    sql.connect(dbconfig, function (err) {
        if (err) {
            console.log(err);
        }
        let sqlQueryPatch = "UPDATE [Request] SET "

        for (var i = 0; i < Object.keys(req.body).length; i++) {
            sqlQueryPatch = sqlQueryPatch + Object.keys(req.body)[i] + " = '" + Object.values(req.body)[i] + "',"
        }
        sqlQueryPatch = sqlQueryPatch.slice(0, sqlQueryPatch.length - 1) + " WHERE id = " + req.query.id;
 
        var sqlRequest = new sql.Request();
        sqlRequest.query(sqlQueryPatch, function (err, recordset) {
            if (err) {
                res.status(400)
                res.send(err);
                console.log(err)
            } else {
                res.status(200)
                res.send('updated')
            }
        });
    });
});



module.exports = router;
