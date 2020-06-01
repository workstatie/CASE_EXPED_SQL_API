function getUserInfo (authToken, callback){
    
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

//cum sa o suni :D 

getUserInfo("eyJraWQiOiJyVGp4dEZaU1VxMUh5a2s3c2pZMHpQMFNucEFRdjZLQktvZG5nQTdnX0JVIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULl8xaENzZlNjWkotdjBWNi0xUlItZ0txemIwakpFbkdWMHhFVGhFcElpbmsiLCJpc3MiOiJodHRwczovL2Rldi00NDQwMzQub2t0YS5jb20vb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNTkxMDMwNDY0LCJleHAiOjE1OTEwMzQwNjQsImNpZCI6IjBvYWFleTR1MTJKRjRGdFdwNHg2IiwidWlkIjoiMDB1YWV2anc5QmE3d2dLSGI0eDYiLCJzY3AiOlsiZW1haWwiLCJvcGVuaWQiXSwic3ViIjoibWloYWljZGVAZ21haWwuY29tIiwiZW1haWwiOiJtaWhhaWNkZUBnbWFpbC5jb20ifQ.j3e-w8hion7ZAwWbwqM5oyfYEe-nmkYdqtBs_8pCmnBwd3_DbC7sgeTVYgLvYjCdrl5DMC-SxcDwgq0ORXpjweRqh7rgzwxVLKiWe3TPx8wjvGauDVgk-jGQFBqX-Eo4bnOfxEHu4Iudz5TCNkAaFXkn53I20Nx6ebWhAJ1dIcDt62uCurT-SFwCP1hQ_36ZHZxcy4BIjIdkZIaihUp6uVPGemP05snFoGk_lOAWQx8l0XtXrwgIoHp6v-N2vv8H9gBdNHKSXFft8L6sRYjRJBr8ZblhZ99FNiSrTzkIWCeHRjcYH0gNHsSkkq0Y0UIYXnSUf1wJM73op0Nby0xqSQ"
,function(test)
{
    console.log(test);
});
