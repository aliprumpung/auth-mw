module.exports =  function(router, passport){

router.get('/', function(req, res, next) {
  res.render('index', { title: 'express'});
});


router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/facebook/callback', 
passport.authenticate('facebook', { successRedirect: '/users',
                                  failureRedirect: '/auth/login' }));

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', 
passport.authenticate('google', { successRedirect: '/users',
                                  failureRedirect: '/auth/login' }));

router.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
router.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));





};