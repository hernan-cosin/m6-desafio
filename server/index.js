"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.get("/env-vars", function (req, res) {
    res.status(202).json({
        port: port,
        enviroment: process.env.NODE_ENV,
        test: true
    });
});
app.listen(port, function () {
    console.log("App running in port ".concat(port));
});
