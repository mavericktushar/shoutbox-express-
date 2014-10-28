var User = require('../lib/user');

exports.form = function(request, response) {
	response.render('login', {
		title: 'Login'
	});
};

exports.submit = function(request, response, next) {
	var data = request.body.user;

	console.dir('username: ' + data.name);
	console.dir('password: ' + data.pass);

	User.authenticate(data.name, data.pass, function (err, user) {
		if(err) return next(err);
		
		if(user) {
			request.session.uid = user.id;
			response.redirect('/');
		} else {
			//response.error("Sorry! Invalid Login.");
			response.redirect('back');
		}
	});
};

exports.logout = function(request, response) {
	request.session.destroy(function(err) {
		if (err) throw err;
		response.redirect('/');
	});
};