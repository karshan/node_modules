// Super simple http client wrapper library

"use strict";

var http = require('http');

function helper(options, cb) {
	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    var data = '';
	    res.on('data', function(chunk) {
	        data += chunk;
	    });
	    res.on('end', function() {
            // TODO better response object structure	
	        cb({"ok": true, "res": res, "data": data});
	    });
	}).on('error', function(e) {
		cb({"error": e});
	});
	if (options.data) {
		req.write(options.data);
	}
	req.end();
}

exports.request = helper;

//options: {"host": "www.google.com", "port": 80, "path": "/"}
//cb: function(response)
//		response: {data: data} or {error: error}
exports.get = function(options, cb) {
	options.method = 'GET';
	options.data = undefined;
	helper(options, cb);
};

//options: {"host": "www.google.com", "port": 80, "path": "/"}
//cb: function(response)
//		response: {data: data} or {error: error}
exports.put = function(options, cb) {
	options.method = 'PUT';
	helper(options, cb);
};

//options: {"host": "www.google.com", "port": 80, "path": "/"}
//cb: function(response)
//		response: {data: data} or {error: error}
exports.post = function(options, cb) {
	options.method = 'POST';
	helper(options, cb);
};

//options: {"host": "www.google.com", "port": 80, "path": "/"}
//cb: function(response)
//		response: {data: data} or {error: error}
exports.delete = function(options, cb) {
	options.method = 'DELETE';
	helper(options, cb);
};
