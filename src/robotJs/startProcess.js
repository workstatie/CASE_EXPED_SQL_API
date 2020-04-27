
//var exec = require('child_process').execFile;

function runApp(){
    console.log('test')
    var execFile = require('child_process').execFile, child;
    child = execFile('C:\\Users\\mihai.andrei\\AppData\\Local\\UiPath\\app-20.3.0-beta0084\\UiRobot.exe', ['-p','HelloWorldMGA'], function(error,stdout,stderr) { 
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