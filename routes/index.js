exports.notFound =  function(request, response){
	response.status(404).format( {
		html: function() {
			response.render('404');
		},

		json: function() {
			response.send({message: 'Resource not found'});
		},

		xml: function() {
			response.write('<error>\n');
			response.write('	<message>Resource not found</message>\n');
			response.write('</error>\n');
		},

		text: function() {
			response.send('Resource not found\n');
		}
	} );
};

exports.error = function(err, request, response, next) {
	console.error(err.stack);
	var msg;

	switch(err.type) {
		case 'database':
			msg = 'Server Unavailable';
			response.statusCode = 503;
			break;

		default:
			msg = 'Internal Server Error';
			response.statusCode = 500;
	}

	response.format( {
		html: function() {
			response.render('5xx', { msg: msg, status: response.statusCode });
		},

		json: function() {
			respnse.send( {error: msg} );
		},

		text: function() {
			response.send(msg + '\n');
		}
	} );
};