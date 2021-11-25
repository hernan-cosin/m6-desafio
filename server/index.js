"use strict";
exports.__esModule = true;
var express = require("express");
var db_1 = require("./db");
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());
var port = process.env.PORT || 3000;
var usersCollection = db_1.firestore.collection("users");
var roomsCollection = db_1.firestore.collection("rooms");
app.get("/env-vars", function (req, res) {
    res.status(202).json({
        port: port,
        enviroment: process.env.NODE_ENV,
        test: true
    });
});
app.post("/signin", function (req, res) {
    var name = req.body.name;
    usersCollection
        .where("name", "==", name)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            usersCollection
                .add({
                name: name
            })
                .then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            res.status(400).json({
                message: "User already exist."
            });
        }
    });
});
app.use(express.static("dist"));
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("App running in port ".concat(port));
});
