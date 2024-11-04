const rewriteImageUrl = require("../utils/rewrite-url-image");
const compressImg = require("../utils/compress-image");
const fs = require("fs");

const Book = require("../model/books");
const User = require("../model/auth");


exports.createBook = (req, res, next) => {
	    let bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
			...bookObject,
			userId: req.auth.userId,
			imageUrl: req.file.path,
		});
    book.averageRating = book.calculateAverageRating();
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
        .catch((error) => {res.status(400).json({ error })});
};


exports.getOneBook = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			return rewriteImageUrl(req, book);
		})
		.then((book) => {
			res.status(200).json(book);
		})
		.catch((error) => {
			res.status(404).json({ error });
		});
};

exports.getAllBooks = (req, res) => {
	Book.find()
		.then((books) => {
			return books.map((book) => rewriteImageUrl(req, book));
		})
		.then((books) => {
			res.status(200).json(books);
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

exports.modifyBook = async (req, res) => {
    delete req.body.ratings;
    if(req.file) {
        req.body.imageUrl = req.file.path
    }
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if(book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé !' });
            } else {
                if(req.file) {
                    const filename = book.imageUrl;
                    fs.unlink(`images/${filename}`, () => {                 
                        Book.updateOne({ _id: req.params.id }, { ...req.body })
                            .then(() => res.status(200).json({ message: 'Livre modifié !'}))
                            .catch(error => res.status(400).json({ error }));
                    })
                } else {
                    Book.updateOne({ _id: req.params.id }, { ...req.body })
                            .then(() => res.status(200).json({ message: 'Livre modifié !'}))
                            .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};


exports.deleteBookId = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message: "Non-autorisé" });
			} else {
				const filename = book.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ message: "Livre supprimé !" }))
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => res.status(500).json({ error }));
}

exports.addRating = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			const hasRated = book.ratings.some(
				(rating) => rating.userId.toString() === req.body.userId
			);
			if (hasRated) {
				return res
					.status(401)
					.json({ message: "Vous avez déjà donné une note !" });
			} else {
				book.ratings.push({
					userId: req.body.userId,
					grade: req.body.rating
				});
				book.averageRating = book.calculateAverageRating();
				return book
					.save()
					.then((updatedBook) => {
						res.status(200).json(updatedBook);
					})
					.catch((error) => res.status(400).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.bestRating = (req, res) => {
	Book.find()
		.sort({ averageRating: -1 })
		.limit(3)
		.then((books) => {
			return books.map((book) => rewriteImageUrl(req, book));
		})
		.then((books) => {
			res.status(200).json(books);
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};
	