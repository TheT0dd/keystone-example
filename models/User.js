var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
	autokey: {
		from: 'username',
		path: 'slug',
		unique: true
	}
});

User.add({
	username: { type: String, required: true, unique: true, index: true, default: ''},
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String, hidden: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

User.relationship({
	path: 'tickets',
	ref: 'Ticket',
	refPath: 'createdBy'
});

// Provide access to Keystone
// NOTE: The user model must have a canAccessKeystone property
// (which can be a virtual method or a stored boolean) that says
// whether a user can access Keystone's Admin UI or not.
// NOTE: If you choose to use a virtual method setting the value in
// mongodb directly will not authenticate correctly. A virtual method
// is useful when the criteria for access is more complex
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.virtual('url').get(function() {
	return '/users/' + this.slug;
});


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
