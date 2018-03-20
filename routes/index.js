require('dotenv').config();
var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');//fbauth
var social = require('../app/config/passport')(passport);
const mw = require('../app/middleWare/index');
var db = require('../app/config/db');
var bcrypt = require('../app/config/bcrypt');
const nodemailer = require('nodemailer');
const saltRounds = 10;


module.exports =  function(router, passport){

router.get('/',mw.isAuthenticated, function(req, res, next) {
res.send(req.user.email);

});


router.get('/create',(req,res,next)=>{

	var myObject ={
		users: {
			id: 'SERIAL primary key',
			email: 'text',
			name: 'text',
			password: 'text',
			session: 'text'
		},
		facebook: {
			id: 'SERIAL primary key',
			email: 'text',
			name: 'text',
			session: 'text'
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
	
var email = 'herokugit@gmail.com';
var name = 'Ali';
var password = 'hash1234567';
var session = 'sss';

bcrypt.hashingPwd(password,saltRounds).then(hash=>{
   
 	
	// var myObject ={users: [{email: email,name: name,password: hash,sesion: session}]}
	var myObject ={
		users: [{
			email: 'hayoo@gmail.com',
			name: 'Joni',
			password: hash,
			sesion: 'blablabla'
		}]
	}


	db.check_ifExistsInDB(myObject,'email',(err,pos)=>{

		var result = {}
		var rdup = db.removes_duplicatesJSON(pos);
		var newArray = db.filter_JSON(rdup,'exists','0');
		db.rem_attrFromJSON(newArray,'exists');
		
		var count = newArray.length.toString();
		
		if (Number(count) > 0){
			result['users'] = newArray;

			db.insert_multirows_json(result).then(pos=>{
			res.status(200).json({status:'ok',message:'success..'});
			}).catch(error=>{
			res.status(500).json({errMsg:error});
			});

		}else{
			res.status(500).json({errMsg:'Email already existed.'});
		}
		
	});


}).catch(err=>{ res.status(500).json({errMsg:err}); });


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

router.get('/sess',(req,res,next)=>{
	
	db.create_sessionTbl().then(pos=>{
		res.status(200).json({msg:'session table successfully created..'});
	}).catch(err=>{
		res.status(500).json({msg:err.message});
	});

});
router.get('/u',(req,res,next)=>{
	
	db.create_usersTbl().then(pos=>{
		res.status(200).json({msg:'users table successfully created..'});
	}).catch(err=>{
		res.status(500).json({msg:err.message});
	});

});

router.get('/send',function(req,res){
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
      let encodedMail = new Buffer('callmesike@gmail.com').toString('base64');
      let link="http://"+req.get('host')+"/verify?_s="+encodedMail+"&id="+rand;
    mailOptions={
    	from: "ALI PRUMPUNG <no-reply@aliprumpung.id>", 
        to : req.query.to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }

  
	res.redirect(link);
















  /*  smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
	});*/


	//run on production mode only
	// nodemailer.mail(mailOptions);
	// res.redirect('/');





});

router.get('/verify',function(req,res){
	var rand = Math.floor((Math.random() * 100) + 54);
	var host = req.get('host');

	if((req.protocol+"://"+req.get('host'))==("http://"+host)){

		console.log(req.query.id + ' - ' + rand);

		// console.log(req.protocol+":/"+req.get('host'));


		let email = new Buffer(req.query._s, 'base64').toString('ascii');


		

			var myObject = {users:[{email:email}]}

			db.check_ifExistsInDB(myObject,'email',(err,pos)=>{
				if ( pos[0].exists=== '1' && pos[0].rand === req.query.id){

				var myObject1 ={
					users: {
						active: true,
						where_AND:{
							email:pos[0].email
						}
					}

				}

				var str_Results = db.exec_query(3,myObject1);

				str_Results.then(rep=>{res.end("<h1>Email "+pos[0].email+" is been Successfully verified");}).catch(err=>{res.send({errMsg:err})});



				}else{
					res.end("<h1>Bad Request</h1>");
				}


			});

		console.log("email is verified");

		
	}
	else
	{
	res.end("<h1>Request is from unknown source");
	}
});






}










