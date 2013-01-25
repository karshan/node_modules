"use strict";

var log = require("log");

exports.writeJSON = function(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(data));
    res.end();
}

exports.getpostJSON = function(options, cb) {
    if (options.request.method !== "POST") {
        return cb({ "error": "not post" });
    }

    var postdata = '';
    options.request.on('data', function(data) {
        postdata += data;
    });

    options.request.on('end', function() {
        var postobj = null;
        try {
            postobj = JSON.parse(postdata);
        } catch(e) {
            return cb({ "error": "bad JSON" });
        }
        options.input = postobj;
        log({input: options.input});

        cb(options);
    });
}
