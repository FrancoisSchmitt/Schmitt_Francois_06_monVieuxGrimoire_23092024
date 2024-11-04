// /api/auth/signup

const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controller/authController");
const booksController = require("../controller/booksController");
// const uploadMiddleware = require('./middlewares/uploadMiddleware');

/**
 * makes path for any routes i need for my api
 */

route.post("/auth/login", userController.userLogin);
route.post("/auth/signup", userController.userCreate);
// route.get("/auth/user", userController.getUser);
// GET /feed/posts

// POST /feed/post
route.post("/books", auth, booksController.createBook);

route.get("/books", booksController.getAllBooks);
route.get("/books/:id", booksController.getOneBook);
route.get("/books/bestrating", booksController.bestRating);

route.delete("/books/:id", auth, booksController.deleteBookId);

route.post("/books/:id/rating", auth, booksController.addRating);

route.put("/books/:id", auth, booksController.modifyBook);

module.exports = route;
