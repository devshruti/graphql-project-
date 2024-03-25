const { buildSchema } = require('graphql');
const { resolvers } = require('./resolvers');

// Define GraphQL schema
const schema = buildSchema(`
type User { 
  _id: ID!
  username: String!
  email: String!
  password: String!
  role: String!
}

type Book {
  _id: ID!
  title: String!
  author: String!
  description: String!
  price: Float!
  owner: User!
}

type Mutation {
  registerUser(username: String!, email: String!, password: String!, role: String!): RegistrationResponse!
  loginUser(email: String!, password: String!): LoginResponse!
  logoutUser(token: String!): String!
  updateBook(id: ID!, title: String, author: String, description: String, price: Float): Book
  deleteBook(id: ID!): Book
  addBook(title: String!, author: String!, description: String!, price: Float!): Book
  borrowBook(bookId: ID!): Book
  buyBook(bookId: ID!): Book
  requestBorrow(bookId: ID!): Book
  approveBorrowRequest(bookId: ID!, borrowerId: ID!): Book
}

type Query {
  getNewToken(refresh_token: String!): TokenResponse!
  getAllBooks: [Book]
  getBookById(id: ID!): Book
  searchBooks(query: String!): [Book]
}

type RegistrationResponse {
  message: String!
}

type LoginResponse {
  message: String!
  accessToken: String!
  refreshToken: String!
  uid: ID!
}

type TokenResponse {
  message: String!
  token: String
}
`);

module.exports = { schema, resolvers };
