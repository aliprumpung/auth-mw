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
// var str_Results = db.insert_rows_json(myObject);
// res.send(str_Results);



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

	/*var rdup = db.removes_duplicatesJSON(pos);
	console.log(rdup);
	var newArray = db.filter_JSON(rdup,'exists','0');
	db.rem_attrFromJSON(newArray,'exists');*/

	res.send(pos);
	

});








	
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





/*
router.get('/test1',(req,res,next)=>{
	var myObj = [ { "email": "hes@gmail.com", "name": "Ali", "password": "1232456", "sesion": "sss", "exists": "1" },
	 { "email": "Jojo@gmail.com", "name": "Ali Prumpung", "password": "123245cccc6", "sesion": "dddsss", "exists": "0" },
	  { "email": "jEje@gmail.com", "name": "Ali P", "password": "123245cccc6", "sesion": "dddsss", "exists": "0" } ]



var newArray = db.filter_JSON(myObj,'exists','1');
db.rem_attrFromJSON(newArray,'exists');

res.send(newArray);


});
          

            	 










const insert_data = (tbl,key,val,myObject,cb)=>{
	
	db.ifDoesntExists(tbl,`${key} = \'${val}\'`).then(pos=>{		
		return db.insert_rows_json(myObject);
	}).then(pos=>{
		cb(pos.rows,true);
	}).catch(err=>{ cb(err,false); });

}

*/


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
module.exports = router;

