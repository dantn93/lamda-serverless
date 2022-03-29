
const resolvers = {
  // QUERY
  Query: {
    books: async (parent, args, context) => {
      return context.dbMethods.getAllBooks();
    },
    book: (parent, args, context) => {
      return context.dbMethods.getBookById(args.id);
    },
    authors: (parent, args, context) => {
      return context.dbMethods.getAllAuthors();
    },
    author: (parent, args, context) => {
      return context.dbMethods.getAuthorById(args.id);
    },
  },
  Book: {
    author: (parent, args, context) => {
      return context.dbMethods.getAuthorById(parent.authorId);
    }
  },
  Author: {
    books: (parent, args, context) => {
      console.log("PARENT: ", parent)
      return context.dbMethods.getAllBookByAuthorId(parent.id);
    }
  },

  // MUTATION
  Mutation: {
    createAuthor: async (parent, args, context) => {
      return context.dbMethods.createAuthor(args);
    },
    updateAuthor: async (parent, args, context) => {
      return context.dbMethods.updateAuthorById(args);
    },
    deleteAuthor: async (parent, args, context) => {
      return context.dbMethods.deleteAuthorById(args);
    },
    createBook: async (parent, args, context) => {
      return context.dbMethods.createBook(args);
    },
    updateBook: async (parent, args, context) => {
      return context.dbMethods.updateBookById(args);
    },
    deleteBook: async (parent, args, context) => {
      return context.dbMethods.deleteBookById(args);
    }
  }
}

module.exports = resolvers;