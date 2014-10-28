var basicAuth = require('basic-auth');
var User = require('../lib/user');
var Entry = require('../lib/entries');

exports.user = function(request, response, next) {
	User.get(request.params.id, function(err, user) {
		//console.dir('request.params.id: ' + request.params.id);
		if(err) return next(err);

		if(!user.id) return response.status(404).end();

		response.json(user);
	});
};

exports.entries = function(request, response, next) {
	Entry.getRange(0, -1, function(err, entries) {
		if(err) return next(err);

		response.format( {
			'application/json': function() {
				response.send(entries);
			},

			'application/xml': function() {
				response.write('<entries>\n');
				entries.forEach(function(entry) {
					response.write('	<entry>\n');
					response.write('		<title>' + entry.title + '</title>\n');
					response.write('		<body>' + entry.body + '</body>\n');
					response.write('		<username>' + entry.username + '</username>\n');
					response.write('	</entry>\n');
				});
				response.end('</entries>');
			}
		} );
	});
};

exports.auth = function(request, response, next) {
	var authUser = basicAuth(request);

	User.authenticate(authUser.name, authUser.pass, function(err, user) {
		if(err) return next(err);

		if(user) {
			request.session.uid = user.id;
			//response.redirect('/');
			//console.dir('user.id: ' + user.id)
			next();
		} else {
			response.status(404).end()
		}
	});
};