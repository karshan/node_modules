/* static_handler.js: an http handler function to server static content. i.e. files.
 * stolen from oweapp
 *
 * Design considerations:
 *  - return an error if file was not found, leave 404 to the upper level
 *  - better way to get content type header
 *    -- better fs/files that has/have metadata ?
 *  - TODO Implement ETAG caching http://betterexplained.com/articles/how-to-optimize-your-site-with-http-caching/
 */

"use strict";

var fs = require("fs");

function getContentType(ext) {
    var contentTypeMap =
    {
        ".txt"  : "text/plain",
        ".html" : "text/html",
        ".js"   : "text/javascript", // TODO check if this is the correct content type
        ".css"  : "text/css", // TODO check this as well
        ".mp4"  : "audio/mpeg",
    }
    if (contentTypeMap[ext])
        return contentTypeMap[ext];
    return "text/plain";
}

// pathname is treated as a pathname for a file in the current working directory (when node was run ofcourse)
// TODO comment
exports.create = function(prefix) {
    return function(options) {
        var pathname = prefix + options.pathname;
        var response = options.response;
        fs.readFile(pathname, function (err, data) {
            if (err) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found");
                response.end();
                return;
            }

            var ext = null;
            if (pathname.lastIndexOf('.') === -1) {
                ext = "";
            } else {
                ext = pathname.substring(pathname.lastIndexOf('.'))
            }

            response.writeHead(200, {
                "Content-Type": getContentType(ext),
                "Content-Length": data.length,
            });
            response.write(data);
            response.end();
        });
    }
}
