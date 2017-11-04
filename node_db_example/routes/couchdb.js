/*couchDBのExampleです*/
var express = require('express');
var router = express.Router();
const util = require('util');
/**/
const NodeCouchDb = require('node-couchdb');

// node-couchdb instance with Memcached 
//Memcached 使うとき
const MemcacheNode = require('node-couchdb-plugin-memcached');
const couchWithMemcache = new NodeCouchDb({
    cache: new MemcacheNode
});

// not admin party 
const couchAuth = new NodeCouchDb({
    host: '127.0.0.1',
    protocol: 'http',
    port: 5984,
    auth: {
        user: 'admin',
        pass: 'password'
    }
});

var dbname;
var dbList;
/* GET home page. */
router.get('/', function(req, res, next) {
    var dblist = "";

    couchAuth.listDatabases().then(function(dbs) {
        console.log(dbs);
        dblist = dbs;
        console.log(dblist);
        var data = {
            'title': 'CouchDB',
            'dbList': dblist
        };

        console.log(data);
        res.render('couchdb', data);
    });
});


router.post('/cruddb', function(req, res, next) {

    console.log(req.body.dbselect);
    dbname = req.body.dbselect;
    var dbname_view = dbname.replace("_db", "");
    var viewUrl = "_design/" + dbname_view + "/_view/get_all";
    console.log(viewUrl);
    couchAuth.get(dbname, viewUrl).then(({ data, headers, status }) => {
        console.log(data);
        dbList = data.rows;
        console.log(dbList);
        // data is json response 
        // headers is an object with all response headers 
        // status is statusCode number 
        var data = {
            'title': 'CouchDB CRUD',
            'dbname': dbname,
            'msg': "db success",
            'dbList': dbList
        };
        console.log(data);
        res.render('couchdb_crud', data);
    }, err => {
        console.log(err.body);
        // either request error occured 
        // ...or err.code=EDOCMISSING if document is missing 
        // ...or err.code=EUNKNOWN if statusCode is unexpected 
        var data = {
            'title': 'CouchDB CRUD',
            'dbname': dbname,
            'msg': "db error",
            'dbList': null
        };
        res.render('couchdb_crud', data);
    });
})

/*Doc作成*/
router.post('/createDoc', function(req, res, next) {
    var data = req.body;
    console.log("[ couch createDoc ]");
    console.log("[title] : " + data.title);
    var titledata = data.title;
    var status;
    var result = { "result": status };
    couchAuth.insert(dbname, {
        title: titledata
    }).then(({ data, headers, status }) => {
        console.log("[couch createDoc SUCCESS]");
        console.log("[ status ] : " + status);
        console.log(status);
        status = true;
    }, err => {
        console.log("[couch createDoc ERROR]");
        console.log(err.body);
        status = false;
    });
    res.send(result);
});

/*Doc 更新*/
router.post('/updateDoc', function(req, res, next) {
    var data = req.body;
    var id = data._id;
    var rev = data._rev;
    console.log(data);
    var newtitledata = req.body.title;
    console.log("[ couch update ]");
    console.log("[title] : " + newtitledata);
    var status;
    var result = { "result": status };

    couchAuth.update(dbname, {
        _id: id,
        _rev: rev,
        title: newtitledata
    }).then(({ data, headers, status }) => {
        console.log("[couch updateDoc SUCCESS]");
        console.log(status);
        status = true;
    }, err => {
        console.log("[couch updateDoc ERROR]");
        console.log(err);
        status = false;
    });
    res.send(result);
});

/*Doc 削除*/
router.post('/deleteDoc', function(req, res, next) {
    var data = req.body;
    console.log(data);

    var _id = data._id;
    var _rev = data._rev;;
    console.log("[ couch delete ]");

    var status;
    var result = { "result": status };

    couchAuth.del(dbname, _id, _rev).then(({ data, headers, status }) => {
        console.log("[couch deleteDoc SUCCESS]");
        console.log(status);
        status = true;
    }, err => {
        console.log("[couch deleteDoc ERROR]");
        console.log(err);
        status = false;
    });
    res.send(result);
});


module.exports = router;

/*
couchdb参考
http://docs.couchdb.org/en/2.1.0/intro/index.html
https://www.npmjs.com/package/node-couchdb
https://www.javatpoint.com/nodejs-couchdb
*/