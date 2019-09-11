export default `
  type Dates {
    published: String
    updated: String
  }
  
  type List {
    _id: ID!
    title: String!
    published: Boolean!
    author: User!
    items: [Item!]!
    date: Dates
  }

  type Query {
    list(_id: ID!): List!
    lists: [List!]!
  }

  type Mutation {
    createList(list: CreateListInput): List!
    updateList(_id: ID!, list: UpdateListInput): List!
    deleteList(_id: ID!): List!
  }

  type Subscription {
    listCreated: ListSubscriptionPayload!
  }

  type ListSubscriptionPayload {
    mutation: MutationType!
    list: List!
  }
  
  input DatesInput {
    published: String
    updated: String
  }

  input CreateListInput {
    title: String!
    published: Boolean!
    author: ID!
    date: DatesInput
  }
  
  input UpdateListInput {
    title: String
    published: Boolean
    date: DatesInput
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;
