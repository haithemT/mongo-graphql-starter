export default `
  type Item {
    _id: ID!
    text: String!
    author: User!
    list: List!
  }

  type Query {
    item(_id: ID!): [Item!]!
    items: [Item!]!
  }

  type Mutation {
    createItem(item: CreateItemInput!): Item!
    updateItem(_id: ID!, item: UpdateItemInput): Item!
    deleteItem(_id: ID!): Item!
  }

  type Subscription {
    item(listId: ID!): ItemSubscriptionPayload!
  }

  type ItemSubscriptionPayload {
    mutation: MutationType!
    Item: Item!
  }

  input CreateItemInput {
    text: String!
    list: ID!
    author: ID!
  }
  
  input UpdateItemInput {
    text: String
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
