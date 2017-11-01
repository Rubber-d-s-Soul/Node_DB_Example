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
        console.log(dblist[0]);
        var data = {
            'title': 'CouchDB',
            'dbList': dblist[0]
        };

        console.log(data);
        res.render('couchdb', data);
    });

});


router.post('/createdb', function(req, res, next) {
    var dbList = "";
    //※keyを決め打ちで渡してしまっています。
    couchAuth.get("seminar_doc", "896e429bba15533c7fc0a7f050001f23").then(({ data, headers, status }) => {
        console.log(data);
        dbList = data.title;
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