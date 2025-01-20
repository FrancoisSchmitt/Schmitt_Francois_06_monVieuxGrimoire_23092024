module.exports = function rewriteImageUrl(req, book) {
	book.imageUrl = `${req.protocol}://${req.get("host")}/images/${
		book.imageUrl
	}`;
	return book;
};
