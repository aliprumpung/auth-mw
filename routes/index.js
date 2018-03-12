require('dotenv').config();
var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');//fbauth
var social = require('../app/config/passport')(passport);
const mw = require('../app/middleWare/index');
var db = require('../app/config/db');


router.get('/',mw.isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Hello from index'});
});

router.get('/test', function(req, res, next) {

var obj = { nama: '1', alamat: 2, notelp: '3'};
var ins_json = db.insertTo_json('user',obj);

var myObject ={
	facebook: {
		id: 'SERIAL primary key',
		token: 'text',
		email: 'text',
		name: 'text'
	},
	Google: {
		id: 'SERIAL primary key',
		token: 'text',
		email: 'text',
		name: 'text'
	}
}



var str_Results = db.createTbl_fromjson(myObject);

res.send(str_Results);
  	  
});



module.exports = router;

