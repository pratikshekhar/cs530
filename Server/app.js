const express = require("express");
const app = express();
var cors = require("cors");

var MongoClient = require("mongodb").MongoClient;
var userCollection;

var db;
// Connect to the db

app.use(cors());

MongoClient.connect(
  "mongodb+srv://pratikshekhar:ZmxknZolLBpfdBRM@cluster0-0k0so.mongodb.net/test?retryWrites=true",

  function(err, dbConn) {
    if (!err) {
      db = dbConn;
      userCollection = dbConn.db("cs530").collection("user");
      console.log("We are connected");
    }
  }
);

app.get("/check", function(req, res) {
  userCollection.find().toArray(function(err, items) {
    res.send(items);
  });
});

app.get("/addToFav", function(req, res) {
  userCollection.update(
    { userName: req.query.userName },
    { $push: { fav: JSON.parse(req.query.cardId) } },
    function(err, response) {
      if (err) {
        res.status(404);
      }
      res.send("");
    }
  );
});

app.get("/getFav", function(req, res) {
  userCollection.findOne({ userName: "pratik" }, { fav: 1 }, function(
    err,
    response
  ) {
    if (err) {
      res.status(404);
    }
    res.send(response.fav);
  });
});

app.get("/removeFromFav", function(req, res) {
  userCollection.updateOne(
    { userName: req.query.userName },
    { $pull: { fav: JSON.parse(req.query.cardId) } },
    function(err, response) {
      if (err) {
        res.status(404);
      }
      res.send("");
    }
  );
});

app.listen(8047, function() {
  console.log("Server On...");
});
