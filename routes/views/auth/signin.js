var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {

	if (req.user) {
		return res.redirect('/mytickets');
	}

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'signin';

	console.log('login form view created');

	view.on('post', function(next) {

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email and password.');
			return next();
		}

		var onSuccess = function() {
			res.redirect('/');
		};

		var onFail = function() {
			req.flash('error', {
				detail: 'Input credentials were incorrect, please try again.'
			});
			return next();
		};

		// This handy method will first check to see if the email that was provided conforms
		// to an email address regex pattern, then it will query our MongoDB database to see if a
		// user exists with the specified email address and compares the password. If the user has
		// provided valid credentials, then the function will create a new session and set the below
		// objects in the request:
		// req.user = user;
		// req.session.userId = user.id;
		keystone.session.signin({
			email: req.body.email,
			password: req.body.password
		}, req, res, onSuccess, onFail);

	});

	view.render('auth/signin');

};
