var User = require('../user');

module.exports = function(request, response, next) {
	var uid = request.session.uid;
	if(!uid) return next();

	User.get(uid, function(err, user) {
		if (err) return next(err);

		request.user = response.locals.user = user;
		next();
	});
};