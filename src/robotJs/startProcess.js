
//var exec = require('child_process').execFile;

function runApp(){
    var execFile = require('child_process').execFile, child;
    child = execFile(process.env.UIPATH_ROBOT_PATH, ['-p','HelloWorldMGA'], function(error,stdout,stderr) { 
    // child = execFile('C:\\UiDouble.exe', function(error,stdout,stderr) { 
       if (error) {
           console.log(error)
   
         }
   
     }); 
     child.on('exit', function (code) { 
       console.log('Child process exited '+
          'with exit code '+ code);
    
     });
        }
module.exports.runApp = runApp;