module.exports = {
	'facebookAuth' : {
		'clientID': process.env.FACEBOOK_ID,
		'clientSecret': process.env.FACEBOOK_SECRET,
		'callbackURL': 'https://auth-mw.herokuapp.com/auth/facebook/callback'
	},

	'googleAuth' : {
		'clientID': process.env.GOOGLE_ID,
		'clientSecret': process.env.GOOGLE_SECRET,
		'callbackURL': 'https://auth-mw.herokuapp.com/auth/google/callback'
	}
}