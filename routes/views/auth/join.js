var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {

	if (req.user) {
		return res.redirect('/tickets');
	}

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'createaccount';
	locals.form = req.body;

	view.on('post', function(next) {

		async.series([

			function(cb) {

				if (!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
					var flashError = {
						title: 'Required fields missing',
						detail: 'Please enter the following:',
						list: []
					};
					if (!req.body.username){
						flashError.list.push('username');
					}
					if (!req.body.firstname){
						flashError.list.push('first name');
					}
					if (!req.body.lastname){
						flashError.list.push('last name');
					}
					if (!req.body.email){
						flashError.list.push('email');
					}
					if (!req.body.password){
						flashError.list.push('password');
					}
					req.flash('error', flashError);
					return cb(true);
				}

				return cb();

			},

			function(cb) {

				keystone.list('User').model.findOne({
					username: req.body.username
				}, function(err, user) {

					if (err || user) {
						req.flash('error', {
							title: 'User already exists with that Username.'
						});
						return cb(true);
					}

					return cb();

				});

			},

			function(cb) {

				keystone.list('User').model.findOne({
					email: req.body.email
				}, function(err, user) {

					if (err || user) {
						req.flash('error', {
							title: 'User already exists with that email address.'
						});
						return cb(true);
					}

					return cb();

				});

			},

			function(cb) {

				var userData = {
					username: req.body.username,
					name: {
						first: req.body.firstname,
						last: req.body.lastname,
					},
					email: req.body.email,
					password: req.body.password
				};

				var User = keystone.list('User').model,
					newUser = new User(userData);

				newUser.save(function(err) {
					return cb(err);
				});

			}

		], function(err) {

			if (err) {
				return next();
			}

			var onSuccess = function() {
				res.redirect('/tickets');
			};

			var onFail = function(e) {
				req.flash('error', {
					title: 'There was a problem signing you up, please try again.'
				});
				return next();
			};

			keystone.session.signin({
				email: req.body.email,
				password: req.body.password
			}, req, res, onSuccess, onFail);

		});

	});

	view.render('auth/join');

};
