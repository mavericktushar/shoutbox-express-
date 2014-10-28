function parseField(field) {
	return field
	.split(/\[|\]/)
	.filter(function(s) { return s; } );
};

function getField(request, field) {
	var val = request.body;

	field.forEach( function(prop) {
		val = val[prop];
	});

	return val;
};

exports.required = function(field) {
	field = parseField(field);

	return function(request, response, next) {
		if(getField(request, field)) {
			next();
		} else {
			response.redirect('back');
		}
	};
};

exports.lengthAbove = function(field, len) {
	field = parseField(field);

	return function(request, response, next) {
		if( getField(request, field).length > len ) {
			next();
		} else {
			response.redirect('back');
		}
	};
};