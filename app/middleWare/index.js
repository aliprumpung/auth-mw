exports.isAuthenticated = (req,res,next)=>{

	if(req.isAuthenticated()){
		return next();
	}else{

	res.redirect('/users/login');
	};

};
exports.middleWareAuth = (req,res,next)=>{

	if(req.isAuthenticated()){
		res.redirect('/');
	}else{

	res.render('login');
	};

};