const mw = require('../middleWare/index');
module.exports =  function(router, passport){


router.get('/',mw.isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'express'});
});

router.get('/login',mw.middleWareAuth, function(req, res, next) {
  res.render('login', { title: 'express'});
});


router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/users/login');
})

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'express'});
});
router.post('/signup', function(req, res, next) {
  res.redirect('/');
});


};