'use strict';
require('dotenv').config({ override: true })
const awsServerlessExpress = require('aws-serverless-express');
const { ApolloServer } = require('apollo-server-lambda');
const app = require('./src/index');
const { dbMethods } = require('./src/models/index');
const typeDefs = require('./src/schema/schema');
const resolvers = require('./src/resolver/resolver');

const apiServer = awsServerlessExpress.createServer(app);

let graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: () => ({ dbMethods })
});

module.exports.apiServer = (event, context) => {
  return awsServerlessExpress.proxy(apiServer, event, context);
}

module.exports.graphqlServer = graphqlServer.createHandler();
