
const mw = require('../middleWare/index');
var bcrypt = require('../config/bcrypt');
var db = require('../config/db');
const saltRounds = 10;
module.exports =  function(router, passport){


router.get('/',mw.isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'express'});
});

router.get('/login',mw.middleWareAuth, function(req, res, next) {
  res.render('login', { title: 'express'});
});


router.post('/login',passport.authenticate('signin',{
	successRedirect:'/',
	failureRedirect:'/users/login'
}));

router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/users/login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'express'});
});

router.post('/signup', (req, res, next)=> {


	req.session.username = req.body.username;
	req.checkBody('email','The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email','Email address must be between 4-100 characters long, please try again.').len(4,100);
	req.checkBody('username','username cannot be empty').notEmpty();
	req.checkBody('password','password is invalid').len(4,15);
	req.check('password','password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/);
	req.checkBody('passwordMatch','password do not match, please try again.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		console.log(`errors: ${JSON.stringify(errors)}`)
		req.session.errors = errors;
		req.session.success = false;
		res.render('index', { title: 'Registration Error.',errors: errors,username:req.session.username});

	}else{
		req.session.success = true;
		



var email = req.body.email;
var username = req.body.username;
var password = req.body.password;
var session = req.session;


bcrypt.hashingPwd(password,saltRounds).then(hash=>{
   
 	var myObject = {
 		users: [{
 			email:email,
 			name:username,
 			password:hash,
 			sesion:session
 		}]}

 
	

	db.check_ifExistsInDB(myObject,'email',(err,pos)=>{
 
		var result = {}
		var rdup = db.removes_duplicatesJSON(pos);
		var newArray = db.filter_JSON(rdup,'exists','0');
		db.rem_attrFromJSON(newArray,'exists');
		
		var count = newArray.length.toString();
		
		if (Number(count) > 0){
			result['users'] = newArray;

			db.insert_multirows_json(result).then(pos=>{
			req.login(username , function(err) {
				console.log(req.username);
					res.redirect('/');
				});
			}).catch(error=>{
			res.status(500).json({errMsg:error});
			});

		}else{
			res.status(500).json({errMsg:'Email already existed.'});
		}
		
	});


}).catch(err=>{ res.status(500).json({errMsg:err}); });


















/*
		bcrypt.hash(password,saltRounds,(error,hash)=>{
			var data = {
				uname: req.body.username,
				pwd:hash
			}
			var last_id = '';
			findOneUsr(data).then(res=>{
				return insertUser(data);
			}).then(res=>{
				last_id = res;

				return getUsers();
			}).then(pos=>{

				setting passport 
				req.login(last_id , function(err) {

					res.redirect('/login');
				});

			}).catch(err=>{req.session.destroy();res.render('index', {username:req.body.username, title:'Registration form',errors: err.message });});



		});
*/


	}

});


}

