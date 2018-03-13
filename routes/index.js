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

// var obj = { nama: '1', alamat: 2, notelp: '3'};
// var ins_json = db.insertTo_json('user',obj);

var myObject ={
	users: [{
		id: 'SERIAL',
		email: 'text',
		name: 'text',
		password: 'text',
		sesion: 'text'
	}]
}
var myObject_1 ={
	users: {
		id: 'SERIAL primary key',
		email: 'text',
		name: 'text',
		password: 'text',
		sesion: 'text',
		where_AND:{
			id:'2',nama:'ALI'
		}
	}




	
}
var myObject_2 ={
	users: {
		where_OR:{
			id:'2'
		}
	}
}



// var str_Results = db.exec_query(2,myObject);
var str_Results = db.insert_raws_json(myObject);
res.send(str_Results);
  	  
});





module.exports = router;

