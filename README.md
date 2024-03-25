# Book Management System

This is a GraphQL-based Book Management System where users can register, login, browse, add, borrow, buy, and manage books.

## Prerequisites
- Node.js installed on your machine
- MongoDB instance

## Installation
1. Clone this repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.

## Configuration
1. Rename `.env.example` to `.env`.
2. Configure MongoDB connection URI and JWT secret keys in the `.env` file.

## Running the Application
- Run `npm start` to start the server.
- The server will be running on `http://localhost:PORT_NUMBER`.

## API Endpoints
- **POST /graphql**: GraphQL API endpoint.
- **POST /register**: Register a new user.
- **POST /login**: Login with existing credentials.
- **POST /logout**: Logout the current user.
- **POST /add-book**: Add a new book (Admin only).
- **POST /borrow-book/:bookId**: Borrow a book.
- **POST /buy-book/:bookId**: Buy a book.
- **GET /books**: Get all books.
- **GET /book/:id**: Get book by ID.
- **DELETE /book/:id**: Delete book by ID (Admin only).

## Testing the API
- Use the provided Postman collection to test the API endpoints.
