/*couchDBのExampleです*/
var express = require('express');
var router = express.Router();
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


router.post('/createdb', function(req, res, next) {
    var dbList = "";
    console.log(req.body.dbselect);
    var dbname = req.body.dbselect;
    var dbname_view = dbname.replace("_db", "");
    var viewUrl = "_design/" + dbname_view + "_view" + "/_view/get_all";
    console.log(viewUrl);
    couchAuth.get(dbname, viewUrl).then(({ data, headers, status }) => {
        console.log(data);
        dbList = data.rows;
        console.log(dbList);
        // data is json response 
        // headers is an object with all response headers 
        // status is statusCode number 
        var data = {
            'title': 'CouchDB',
            'dbList': dbList
        };
        console.log(data);
        res.render('couchdb', data);
    }, err => {
        console.log(err.body);
        // either request error occured 
        // ...or err.code=EDOCMISSING if document is missing 
        // ...or err.code=EUNKNOWN if statusCode is unexpected 
    });
})


module.exports = router;

/*
couchdb参考
http://docs.couchdb.org/en/2.1.0/intro/index.html
https://www.npmjs.com/package/node-couchdb
https://www.javatpoint.com/nodejs-couchdb
*/