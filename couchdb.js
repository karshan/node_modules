// TODO comment this file
// TODO implement ETAG caching, couchdb uses ETAG headers

"use strict";

var http = require("http_util");

exports.create = function(settings) {
    // TODO: make sure that all functions called here can call each other using "this"
    return {
        uuidCache: [],
        // options: { db: "", doc: "", success: function() {}, error: function() {} }
        // cb: function(out) out = {"data": {}} or {"error": error}
        get: (function(options, cb) {
            http.get({
                host: settings.host,
                port: settings.port,
                path: '/' + options.db + '/' + options.doc
            }, function(res) {
                if (res.error) {
                    cb(res);
                    return;
                }

                var dataobj = null;
                try {
                    dataobj = JSON.parse(res.data);
                } catch(e) {
                    cb({"error":  e, "plaintext": res.data});
                    return;
                }

                cb(dataobj); // this also might be an error which we are relaying
            });
        }),
        // options: { db: "", doc: "", data: {}
        // cb: function(out) out = {"data": {}} or {"error": error}
        put: (function(options, cb) {
            http.put({
                host: settings.host,
                port: settings.port,
                data: JSON.stringify(options.data),
                path: '/' + options.db + '/' + options.doc
            }, function(res) {
                if (res.error) {
                    cb(res);
                    return;
                }

                var dataobj = null;
                try {
                    dataobj = JSON.parse(res.data);
                } catch(e) {
                    cb({"error": e, "plaintext": res.data});
                    return;
                }

                cb(dataobj);
            });
        }),

        delete: (function(options, cb) {
            http.request({
                method: "DELETE",
                host: settings.host,
                port: settings.port,
                path: '/' + options.db + '/'
            }, function(res) {
                if (res.error) {
                    cb(res);
                    return;
                }
                
                var dataobj = null;
                try {
                    dataobj = JSON.parse(res.data);
                } catch(e) {
                    cb({"error": e, "plaintext": res.data});
                    return;
                }

                cb(dataobj);
            });
        }),

        // options: { db: "", doc: "", data: {}
        // cb: function(out) out = {"data": {}} or {"error": error}
        post: (function(options, cb) {
            http.post({
                host: settings.host,
                port: settings.port,
                data: JSON.stringify(options.data),
                path: '/' + options.db + '/' + options.doc,
                headers: { "Content-Type": "application/json" }
            }, function(res) {
                if (res.error) {
                    cb(res);
                    return;
                }

                var dataobj = null;
                try {
                    dataobj = JSON.parse(res.data);
                } catch(e) {
                    cb({"error": e, "plaintext": res.data});
                    return;
                }

                cb(dataobj);
            });
        }),

        // cb: function(out) out = {"uuid": uuid} or {"error": error}
        // TODO: check this caching nonsense I wrote earlier, should work but isnt tested
        uuid: (function(cb) {
            var couchdb = this;
            if (couchdb.uuidCache.length > 0) {
                cb({"uuid": uuidCache.pop()});
                return;
            }

            http.get({
                host: settings.host,
                port: settings.port,
                path: '/_uuids',
            }, function(res) {
                if (res.error) {
                    cb(res);
                    return;
                }

                var dataobj = null;
                try {
                    dataobj = JSON.parse(res.data);
                } catch(e) {
                    cb({"error": e, "plaintext": res.data});
                    return;
                }
                for (var i in dataobj.uuids) {
                    couchdb.uuidCache.push(dataobj.uuids[i]);
                }

                cb({"uuid": couchdb.uuidCache.pop()});
            });
        }),

        view: (function(options, cb) {
            options.db += "/_design";
            options.doc += "/_view/" + options.view;
            if (options.data) {
                this.post(options, cb);
            }
            else {
                this.get(options, cb);
            }
        })
    };
}
