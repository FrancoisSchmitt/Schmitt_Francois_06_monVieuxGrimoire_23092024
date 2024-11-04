module.exports = function rewriteImageUrl(req, book) {
	book.imageUrl = `${req.protocol}://${req.get("host")}/${
		book.imageUrl
	}`;
	return book;
};
