# Apollo 2 Subscriptions Example

Basic subscriptions implementation with Apollo 2 and Express for learning purposes.

## Subscribe

Open [localhost:4000/graphql](http://localhost:4000/graphql), paste the subscription below and hit run.

```graphql
subscription info {
  info
}
```

## Publish

In a new tab, open [localhost:4000/graphql](http://localhost:4000/graphql), and make the query:

```graphql
query go {
  go
}
```

Go to the subscription tab and notice the Hello World payload!

A simplified implementation based on the article [GraphQL Subscriptions Using Apollo 2](https://hackernoon.com/graphql-subscriptions-using-apollo-2-3eb3184768c4) by
