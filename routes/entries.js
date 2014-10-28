var Entry = require('../lib/entries');

exports.form = function(request, response) {
	response.render('post', {
		title: 'Post'
	});
};

exports.submit = function(request, response, next) {
	var data = request.body.entry;

	console.log('data.title: ' + data.title + 'data.body: ' + data.body);
	var entry = new Entry({
		username: response.locals.user.name,
		title: data.title,
		body: data.body
	});

	entry.save(function(err) {
		if(err) return next(err);

		if(request.remoteUser) {
			response.json({message: 'Entry Added.'});
		} else {
			response.redirect('/');
		}
	});
};

exports.list = function(request, response, next) {
	Entry.getRange(0, -1, function(err, entries) {
		response.render('entries', {
			title: 'Entries',
			entries: entries
		});
	});
};