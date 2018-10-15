const { GraphQLServer } = require('graphql-yoga');
const db = require('./db');
const resolvers = require('./resolvers');

// Create the GraphQL Yoga Server.

function createServer() {
  return new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({
      ...req,
      db
    })
  });
}

module.exports = createServer;