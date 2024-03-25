const { isAdminMiddleware, authMiddleware } = require("../middleware/authenticate");
const { BookModel } = require("../model/bookModel");

const bookResolvers = {
    Query: {
        getAllBooks: async () => {
            return await BookModel.find();
        },
        getBookById: async (_, { id }) => {
            return await BookModel.findById(id);
        },
        searchBooks: async (_, { query }) => {
            return await BookModel.find({ $or: [{ title: { $regex: query, $options: 'i' } }, { author: { $regex: query, $options: 'i' } }] });
        }
    },
    Mutation: {
        addBook: async (_, { title, author, description, price }, { user }) => {
            authMiddleware(user)
            isAdminMiddleware(user);

            const book = new BookModel({ title, author, description, price, owner: user._id });
            await book.save();
            return book;
        },
        updateBook: async (_, { id, title, author, description, price }, { user }) => {
            authMiddleware(user)
            isAdminMiddleware(user);

            return await BookModel.findByIdAndUpdate(id, { title, author, description, price }, { new: true });
        },
        deleteBook: async (_, { id }, { user }) => {
            authMiddleware(user)
            isAdminMiddleware(user);

            return await BookModel.findByIdAndDelete(id);
        },
        borrowBook: async (_, { bookId }, { user }) => {
            authMiddleware(user)

            const book = await BookModel.findById(bookId);
            if (!book) {
                throw new Error('Book not found.');
            }
            if (book.owner.toString() === user._id.toString()) {
                throw new Error('You already own this book.');
            }
            if (book.borrower) {
                throw new Error('This book is already borrowed.');
            }
            book.borrower = user._id;
            await book.save();
            return book;
        },
        buyBook: async (_, { bookId }, { user }) => {
            authMiddleware(user)

            const book = await BookModel.findById(bookId);
            if (!book) {
                throw new Error('Book not found.');
            }
            if (book.owner.toString() === user._id.toString()) {
                throw new Error('You already own this book.');
            }
            if (book.borrower) {
                throw new Error('This book is already borrowed.');
            }
            book.owner = user._id;
            await book.save();
            return book;
        },
        requestBorrow: async (_, { bookId }, { user }) => {
            authMiddleware(user)

            try {
                const book = await BookModel.findById(bookId);
                if (!book) {
                    throw new Error('Book not found.');
                }
                if (book.owner.toString() === user._id.toString()) {
                    throw new Error('You already own this book.');
                }
                if (book.borrower) {
                    throw new Error('This book is already borrowed.');
                }
                book.borrowRequest = user._id;
                await book.save();
                return book;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        approveBorrowRequest: async (_, { bookId, borrowerId }, { user }) => {
            authMiddleware(user)

            try {
                const book = await BookModel.findById(bookId);
                if (!book) {
                    throw new Error('Book not found.');
                }
                if (book.owner.toString() !== user._id.toString()) {
                    throw new Error('You are not the owner of this book.');
                }
                if (!book.borrowRequest || book.borrowRequest.toString() !== borrowerId) {
                    throw new Error('No borrow request found from this user.');
                }
                // Transfer ownership to the borrower
                book.owner = borrowerId;
                book.borrower = borrowerId;
                book.borrowRequest = null; // Clear borrow request
                await book.save();
                return book;
            } catch (error) {
                throw new Error(error.message);
            }
        }
    }
};

module.exports = { bookResolvers };
