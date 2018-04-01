
module.exports =  function(router, passport){

	router.get('/', function(req, res, next) {

	res.render('account', { title: 'Home from index', userid:'1234556789'});

	});
	router.get('/register', function(req, res, next) {
		var data = {};
		data.title = 'Registration';
		// data.arr = {x:1,y:1};
	
	res.render('account', data);

	
	});
	router.post('/register', function(req, res, next) {
	
	res.status(200).json({success:true,message:'user registered.'});
	
	});
	router.get('/login', function(req, res, next) {

	res.render('account', { title: 'User Login', userid:'1234556789'});

	});
	

}










