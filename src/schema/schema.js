const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: ID,
    name: String,
    genre: String,
    author: Author
  }

  type Author {
    id: ID,
    name: String,
    age: Int,
    books: [Book]
  }

  # ROOT TYPE
  type Query {
    books: [Book],
    book(id: ID): Book,
    authors: [Author],
    author(id: ID): Author
  }

  # MUTATION
  type Mutation {
    createAuthor( name: String, age: Int ): Author,
    updateAuthor( authorId: ID!, name: String, age: Int ): Author
    deleteAuthor( authorId: ID! ): Author

    createBook( name: String, genre: String, authorId: ID! ): Book
    updateBook( bookId: ID!, name: String, genre: String, authorId: ID! ): Book
    deleteBook( bookId: ID! ): Book

  }
`;

module.exports = typeDefs;