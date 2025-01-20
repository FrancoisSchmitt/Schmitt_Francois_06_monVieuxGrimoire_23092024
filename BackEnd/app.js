const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/connection");
const app = express();
const fs = require("fs");

app.use("/images", express.static(path.join(__dirname, "images")));

// Config .env
dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;
console.log("port", PORT);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,POST,PUT,PATCH,DELETE,OPTIONS"
	);
	next();
});

app.use(
	cors({
		origin: "*",
	})
);
// mongodb connection
connectDB();
// parse request to body-parser

app.use(express.json());
// app.use(bodyparser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

// load routers
app.use("/api", require("./routes/router"));

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
