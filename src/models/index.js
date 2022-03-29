const {
  create: createAuthor,
  getAll: getAllAuthors,
  getById: getAuthorById,
  update: updateAuthorById,
  delete: deleteAuthorById
} = require('./author');

const {
  create: createBook,
  getAll: getAllBooks,
  getById: getBookById,
  update: updateBookById,
  delete: deleteBookById,
  getAllBookByAuthorId,
} = require('./book');



module.exports = {
  dbMethods: {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById,

    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,
    getAllBookByAuthorId
  }
}
