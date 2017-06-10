var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/newdb";
var fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


 app.post('/adduser', function (req, res) {

    res.status(200).send(req.body);

    response = {
        name:req.body.name,
        password:req.body.password,
        profession:req.body.profession,
        id:req.body.id
    };
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection("customers").insertOne(response, function(err, res) {
            if (err) throw err;
            console.log("1 record inserted");

            db.close();
        });
    });
});


app.delete('/deleteuser', function (req, res) {
    var id=req.body;
    console.log(id);
    // First read existing users.
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("customers").remove(id, function(err, obj) {
            if (err) throw err;
            console.log(obj.result + " document(s) deleted");
            res.end(JSON.stringify(req.body));
            db.close();
        });
    });

})


app.put('/updateuser', function (req, res) {
    var id=req.body;
    console.log(id);
    // First read existing users.
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var newvalues = { name: "pankaj",
            "password" : "password2",
            "profession" : "librarian",
            "id": 6};
        db.collection("customers").update(id, newvalues, function(err, result) {
            if (err) throw err;
            console.log( " document(s) update");
            res.end( JSON.stringify(result));
            db.close();
        });
    });

})

app.get('/listuser', function (req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection("customers").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            var a=JSON.stringify(result);
            //res.redirect('showuser.html');
            db.close();
        });
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on http://localhost:' + port);
