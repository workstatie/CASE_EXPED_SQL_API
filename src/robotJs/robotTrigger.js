var express = require('express');
var router = express.Router();

//Get GetTrackingInfo by ID
router.post('/StartRobot', function (req, res, next) {
  var execFile = require('child_process').execFile, child;
  var args = '';
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

module.exports = router;

