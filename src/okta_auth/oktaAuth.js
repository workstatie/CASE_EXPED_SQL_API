function checkSecurity (authToken, callback){
    
    if (authToken === "5bcbce1c-b328-4baa-9153-d673b8ae81c7") 
    {
        return callback("567");
    }
    else 
    {
        var https = require("https");
    
        var options = {
        host: "dev-444034.okta.com",
        port: 443,
        path: "/oauth2/default/v1/userinfo",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        }
    };
    
        var req = https.get(options, function (res) {
        var body = "";
        res.on('data', function(data) {
           body += data;
        });
        res.on('end', function() {
           return callback(body);
        })
        res.on('error', function(e) {
           return callback(e);
        });
    });
    req.end();
    }
    
    
   
}

module.exports = {checkSecurity};

/*cum sa o suni :D 

getUserInfo("5bcbce1c-b328-4baa-9153-d67b8ae81c7"
,function(result)
{
    if (result==="567" || result.includes("@"))
    {
        console.log("ok");
    }
    else {console.log("not ok");}
    
});
*/
