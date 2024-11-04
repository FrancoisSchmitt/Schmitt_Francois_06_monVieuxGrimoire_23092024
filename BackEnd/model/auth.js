const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true, unique: true
	},
	password: {
		type: String,
		required: true
	},
});

const userDB = mongoose.model("auth", schema);

module.exports = userDB;
