var express = require('express');
var router = express.Router();

//Get GetTrackingInfo by ID
router.post('/StartRobot', function (req, res, next) {
  var execFile = require('child_process').execFile, child;
  var args = '';
  console.log(req.query)
  console.log(args)
  if (req.body) {
    args = JSON.stringify(req.body);
  }

  child = execFile(process.env.UIPATH_ROBOT_PATH, ['-p', req.query.processName, '--input', args], function (error, stdout, stderr) {
    if (error) {
      res.send(error)

    }
    else {
      res.send(stdout)
    }
  })

});



 router.get('/GetProcesses', function (req, res, next) {

  sql.connect(dbconfig, function (err) {
    if (err) {
        console.log(err);
    }
    var request = new sql.Request();
    queryValue = "SELECT TOP 1 \
    Job_Scheduler.job_type_id, Job_Scheduler.payload  \
    FROM Job_Scheduler, Job_names \
    where \
    Job_scheduler.job_type_id = Job_names.id \
    and Job_scheduler.status = 1 \
    and Job_names.background_flag = " + req.query.background_flag + " \
    and Job_scheduler.start_date <= getdate() \
    order by Job_scheduler.priority, Job_scheduler.start_date asc " 
    
    
        request.query(queryValue, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            res.send(recordset);
            
        });
    });
});

router.patch('/SetJobStatus', function (req, res) {

  sql.connect(dbconfig, function (err) {
      if (err) {
          console.log(err);
      }

      if(req.query.job_id){
        let sqlQueryPut = "Update Job_Scheduler set status="+req.query.job_status+ " , last_run_time=getdate()  where Job_Scheduler.id="+req.qyer.job_id
       
      }
      else {
        let sqlQueryPut = "Update Job_Scheduler set status="+req.query.job_status+ ", last_run_time=getdate(), start_date=dateadd(hour,2,getdate()) where Job_Scheduler.id="+req.qyer.job_id
      }

     
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

router.post('/AddNewJobs', function (req, res) {
  const request = req.body;


  sql.connect(dbconfig, function (err) {
      if (err) {
          console.log(err);
      }

          let sqlQueryPost = "INSERT INTO [dbo].[Job_Scheduler] ("

      for (var i = 0; i < Object.keys(req.body).length; i++) {
          sqlQueryPost = sqlQueryPost + Object.keys(req.body)[i] + ",";
      }

      sqlQueryPost = sqlQueryPost + " ) OUTPUT SCOPE_IDENTITY()  VALUES ( '"
      for (var i = 0; i < Object.keys(req.body).length; i++) {
          sqlQueryPost = sqlQueryPost + Object.values(req.body)[i] + "','"
      }
      sqlQueryPost = sqlQueryPost.slice(0, sqlQueryPost.length - 2) + " ) SELECT SCOPE_IDENTITY() as id";
      console.log(sqlQueryPost)

      var sqlRequest = new sql.Request();

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


module.exports = router;



/*GetProcesses

SELECT TOP 1
    
Job_Scheduler.job_type_id, Job_Scheduler.payload 

FROM Job_Scheduler, Job_names
where
Job_scheduler.job_type_id = Job_names.id
and Job_scheduler.status = 1
and Job_names.background_flag = X /*X is parameter UI/Backround
and Job_scheduler.start_date <= getdate()
order by
Job_scheduler.priority, Job_scheduler.start_date asc


SetJobStatus
Update Job_Scheduler set status=X, last_run_time=getdate(), start_date=Z /*optional where Job_Scheduler.id=Y

AddNewJobs
INSERT INTO [dbo].[Job_Scheduler]
        ([job_type_id]
        ,[payload]
        ,[priority]
        ,[start_date]
        ,[status]
        ,[last_run_time])
  VALUES
     valori din robot */

