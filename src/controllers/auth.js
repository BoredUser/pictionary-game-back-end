const mongoose = require("mongoose");
const User = mongoose.model("User");

const register = (req, res, next) => {
    console.log(req.body);
	const user = req.body;

	if (!user) {
		const error = new Error("User details not sent in request body");
		next(error);
		return;
	}

	User.create(user)
		.then((updatedUser) => {
			const dataToSend = {
				userName: updatedUser.userName,
				email: updatedUser.email,
				role: updatedUser.role,
			};

			res.status(201).json(dataToSend);
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				err.status = 400;
			} else {
				err.status = 500;
			}

			return next(err);
		});
};

const login = (req, res, next) => {
	// this has { email: string, password: string }
	const u = req.body;

	if (!u) {
		const error = new Error("Login details not sent in request body");
		next(error);
		return;
	}

	if (!u.email || !u.password) {
		const error = new Error("Login details not sent in request body");
		next(error);
		return;
	}

	User.findOne({ email: u.email })
		.then((user) => {
			if (!user) {
				const error = new Error("No matching credentials");
				error.status = 404;
				return next(error);
			}

			// check if password matches the hashed one in DB
			user.checkPassword(u.password, (err, isMatch) => {
				if (err) {
					const error = new Error("No matching credentials");
					error.status = 404;
					return next(error);
				}

				if (!isMatch) {
					const error = new Error("No matching credentials");
					error.status = 404;
					return next(error);
				}

				res.json({
					userName: user.userName,
				});
			});
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				err.status = 400;
			} else {
				err.status = 500;
			}

			return next(err);
		});
};

module.exports = {
	register,
	login,
};
