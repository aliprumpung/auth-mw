module.exports = {
	'facebookAuth' : {
		'clientID': process.env.FACEBOOK_ID,
		'clientSecret': process.env.FACEBOOK_SECRET,
		'callbackURL': process.env.FACEBOOK_CALLBACKURL
	},

	'googleAuth' : {
		'clientID': process.env.GOOGLE_ID,
		'clientSecret': process.env.GOOGLE_SECRET,
		'callbackURL':  process.env.GOOGLE_CALLBACKURL
	}
}
// 'callbackURL': 'https://auth-mw.herokuapp.com/auth/facebook/callback'