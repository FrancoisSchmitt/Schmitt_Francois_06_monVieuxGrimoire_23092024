const Userdb = require("../model/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 *
 * @userLogin {*} Request to connect myself to make other request api
 */

exports.userCreate = async (req, res) => {
	 Userdb.findOne({ email: req.body.email })
			.then((user) => {
				if (user) {
					return res.status(401).json({ message: "Utilisateur déjà créé !" });
				} else {
					bcrypt
						.hash(req.body.password, 10)
						.then((hash) => {
							const user = new User({
								email: req.body.email,
								password: hash,
							});
							user
								.save()
								.then(res.status(201).json({ message: "Utilisateur créé !" }))
								.catch((error) => res.status(400).json({ error }));
						})
						.catch((error) => res.status(500).json({ error }));
				}
			})
			.catch((error) => res.status(500).json({ error }));
};

exports.userLogin = (req, res, next) => {
	Userdb.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user.id,
						token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
							expiresIn: "24h",
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// exports.getUser = (req, res) => {
// 	Userdb.find()
// 		.then((user) => res.status(200).json(user))
// 		.catch((error) => res.status(400).json({ error }));
// };
