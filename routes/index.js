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






// var str_Results = db.exec_query(2,myObject);





	
// insert_data('users','email','jojocccc@gmail.com',myObject,(err,reply)=>{
// 	if(reply === true){
// 		res.status(200).json({status:'successfully inserted'});
// 	}else{
// 		res.status(409).json({errorMsg:err});
// 	}
// });
		

		// db.ifExists('users',`email = 'hes@gmail.com'`).then(pos=>{
		// 	 var items = Object.keys(pos[0]);
		// 	 var key='',val='';
		// 	 items.forEach((item)=> {key=item;val=pos[0][item]});
		// 	return db.rem_dataFrom('users',`${key} = '${val}'`)
			

		// })
  // 	  .then(pos=>{
  // 	  	res.status(200).json({message:'successfully deleted'}
  // 	  		);
  // 	  }).catch(err=>{ res.status(500).json(err)});



});






router.get('/createtbl',(req,res,next)=>{

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


router.get('/inserttbl_duplicate',(req,res,next)=>{

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




router.get('/inserttbl_noduplicate',(req,res,next)=>{

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























module.exports = router;















