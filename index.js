const express = require('express')
const http = require('http')
const { ApolloServer, gql, PubSub } = require('apollo-server-express')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    go: String!
  }
  type Subscription {
    info: String!
  }
`

// Resolvers initialized with pubsub for subscriptions
const resolvers = setupResolvers()

function setupResolvers() {
  const pubsub = new PubSub()
  const TOPIC = 'topic'
  return {
    Query: {
      go: () => {
        // pubsub.publish(triggerName, payload)
        pubsub.publish(TOPIC, { info: 'Hello world!' })
        return 'going'
      }
    },

    Subscription: {
      info: {
        subscribe: () => pubsub.asyncIterator([TOPIC])
      }
    }
  }
}

function setupGraphQL() {
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}

function setupExpress() {
  const PORT = 4000
  const app = express()

  // graphQL
  const server = setupGraphQL()
  server.applyMiddleware({ app })

  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${
        server.subscriptionsPath
      }`
    )
  })

  return {
    app
  }
}

setupExpress()
