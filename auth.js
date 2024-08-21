const jwt = require("jsonwebtoken");
require('dotenv').config();

// Token creation
/*
Analogy
    Pack the gift and provide a lock with the secret code as the key
*/
module.exports.createAccessToken = (user) => {

	// payload
    // When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
	};

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}

// Token verification
module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization)

	let token = req.headers.authorization;

	if(typeof token === "undefined") {

		return res.send({ auth: "Failed. No Token"});

	} else {
		console.log(token)
		token = token.slice(7, token.length);
		console.log(token);

		// Token verification
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				});
			} else {
				console.log("Result from verify method:")
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}
		})
	}
}


// Error handler
module.exports.errorHandler = (err, req, res, next) => {
	console.log(err);

	const statusCode = err.status || 500
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})
}


// Middleware to check if the use is authenticated
module.exports.isLoggedIn = (req, res, next) => {

	if(req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
}