/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);

	app.get('/tickets', routes.views.tickets.ticketlist);
	app.get('/tickets/:ticketslug', routes.views.tickets.singleticket);

	app.all('/createticket', middleware.requireUser, routes.views.tickets.newticket);

	// Auth related routes
	app.all('/join', routes.views.auth.join);
	app.all('/signin', routes.views.auth.signin);
	app.get('/signout', routes.views.auth.signout);
	app.all('/forgotpassword', routes.views.auth.forgotpassword);
	app.all('/resetpassword/:key', routes.views.auth.resetpassword);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	// NOTE: To add multiple middleware (callbacks), add them as multiple arguments, or as a single array of multiple functions:
	// app.get('/multi-middleware', middleware.firstMiddleware, middleware.secondMiddleware, routes.views.someCallback);
};
