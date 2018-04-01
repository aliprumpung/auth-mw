	var express = require('express');
	var router = express.Router();
	const Mw = require('./mw/jwt');
	const Ctrl = require('./controllers/index');
	var bcrypt = require('../../back-end/auth/bcrypt');
	var randtoken = require('rand-token');

	//GET http://localhost:3000/checkauth?token= <Your_Token here>
	module.exports =  function(router, passport){

	router.get('/payexpress', Ctrl.users_get_token);
	router.post('/', Ctrl.users_post_token);
	router.get('/verify',Mw.noHeader, Ctrl.users__AuthResult);
	router.post('/verify', Mw.usingHeader, Ctrl.users__AuthResult);
	router.post('/checkToken', Mw.checkToken, Ctrl.users__AuthResult);

	router.get('/a',(req,res,next)=>{
		var my=`{username:'callmesike@gmail.com',pwd:'12wefgfdd'}`;
		let encodedMail = new Buffer(my).toString('base64');

		res.send(randtoken.generate(32));
	});


	}
