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

// Provide resolver functions for your schema fields
const resolvers = {
  ...setupGraphQLSubs()
}

function setupGraphQLSubs() {
  const pubsub = new PubSub()

  const TOPIC = 'infoTopic'
  const infos = ['info1', 'info2', 'info3', 'done']

  const publish = () => {
    infos.forEach((info, index) => {
      setTimeout(() => {
        console.log(`subscription sent ${info}`)
        pubsub.publish(TOPIC, { info })
      }, 1000 * index)
    })
  }

  return {
    Query: {
      go: () => {
        publish()
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
  const resolvers = setupGraphQLSubs()
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
  server.applyMiddleware({
    app,
    path: '/graphql'
  })

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
