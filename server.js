const express = require('express');
const { schema, resolvers } = require('./resolver/graphql');
const { connectedDB } = require("./config/db");
const { authMiddleware } = require("./middleware/authenticate");
const { ApolloServer } = require('apollo-server-express');

const app = express();
require("dotenv").config();

app.use(express.json());

app.get("/", async (req, res) => {
    try {
        res.send("Home-Page");
    } catch (error) {
        console.log(`Error:${error}`);
    }
});

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }) => ({ user: req.user }),
});

// Start Apollo Server first
async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer();

app.use(authMiddleware);

const port = process.env.PORT || 8080;
app.listen(port, async () => {
    try {
        await connectedDB;
        console.log("Database connected Successfully");
    } catch (err) {
        console.log(err.message);
    }
    console.log(`server is running on port ${port}`);
});
