// resolvers.js
const { userResolvers } = require('./userRsolver');
const { bookResolvers } = require('./bookResolver');

const resolvers = {
    ...userResolvers,
    ...bookResolvers,
};

module.exports = { resolvers };
