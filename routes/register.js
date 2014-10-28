var User = require('../lib/user');

exports.form = function(request, response) {
	response.render('register', {
		title: 'Register'
	});
};

exports.submit = function(request, response, next) {
	var data = request.body.user;

	console.dir('username: ' + data.name);
	console.dir('password: ' + data.pass);

	User.getByName(data.name, function(err, user) {
		if(err) return next(err);

		if(user.id) {
			//response.error('Username already exists');
			response.redirect('back');
		} else {
			var user = new User({
				name: data.name,
				pass: data.pass
			});

			user.save(function(err) {
				if(err) return next(err);

				console.log('user.id: ' + user.id);
				request.session.uid = user.id;
				response.redirect('/');
			});
		}
	});
};