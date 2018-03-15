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

router.get('/create',(req,res,next)=>{

	var myObject ={
		users: {
			id: 'SERIAL primary key',
			email: 'text',
			name: 'text',
			password: 'text',
			sesion: 'text'
		},
		facebook: {
			id: 'SERIAL primary key',
			email: 'text',
			name: 'text',
			sesion: 'text'
		}
	}

	db.exec_query(1,myObject).then(pos=>{
		res.status(200).json({message:pos});
	}).catch(err=>{
		res.status(409).json({errorMsg:err.message});
	});
});


router.get('/insert_dupl',(req,res,next)=>{

	var myObject ={
		users: [{
			email: 'hayoo@gmail.com',
			name: 'Joni',
			password: '12432',
			sesion: 'blablabla'
		},{
			email: 'yes@gmai.com',
			name: 'jono',
			password: '-098',
			sesion: 'cjxklz'
		},{
			email: 'cihy@gmail.com',
			name: 'jonoooo',
			password: '489302',
			sesion: 'ncxmee'
		}]
	}

  // duplicatable way
  db.insert_multirows_json(myObject).then(pos=>{
  	res.send(pos);
  }).catch(err=>{
  	res.send(err.message);
  });

});




router.get('/insert_nodupl',(req,res,next)=>{

	var myObject ={
		users: [{
			email: 'hes@gmail.com',
			name: 'Ali',
			password: '1232456',
			sesion: 'sss'
		},{
			email: 'Jojo@gmail.com',
			name: 'Ali Prumpung',
			password: '123245cccc6',
			sesion: 'dddsss'
		},{
			email: 'jojo@gmail.com',
			name: 'Ali Prumpung',
			password: '123245cccc6',
			sesion: 'dddsss'
		},{
			email: 'jEje@gmail.com',
			name: 'Ali P',
			password: '123245cccc6',
			sesion: 'dddsss'
		}]
	}




	db.check_ifExistsInDB(myObject,'email',(err,pos)=>{

		var result = {}
		var rdup = db.removes_duplicatesJSON(pos);
		var newArray = db.filter_JSON(rdup,'exists','0');
		db.rem_attrFromJSON(newArray,'exists');
		result['users'] = newArray;



		db.insert_multirows_json(result).then(pos=>{
			res.send(pos);
		}).catch(err=>{
			res.send(err.message);
		});

	});


});



router.get('/edit',(req,res,next)=>{

	var myObject ={
		users: {
			email: 'hes@gmail.com',
			name: 'Ali Prumpung ',
			password: '123245cccc6',
			sesion: 'dddsss',
			where_AND:{
				email:'hes@gmail.com'
			}
		}

	}

	db.exec_query(3,myObject).then(pos=>{
		res.send(pos);
	}).catch(err=>{
		res.send(err);
	});

});


router.get('/delete',(req,res,next)=>{

	var myObject ={
		users: {
			where_OR:{
				email:'jEje@gmail.com'
			}
		}
	}

	db.exec_query(4,myObject).then(pos=>{
		res.send(pos);
	}).catch(err=>{
		res.send(err);
	});


});





module.exports = router;















