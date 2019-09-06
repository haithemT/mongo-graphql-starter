export default `
  type User {
    _id: String!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    age: Int!
    lists: [List!]!
    items: [Item!]!
  }

  type Query {
    user(_id: ID!): User!
    users: [User!]!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Mutation {
    signup(user:CreateUserInput): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createUser(user: CreateUserInput): User!
    updateUser(_id: String!, user: UpdateUserInput!): User!
    deleteUser(_id: String!): User!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }
  
  input UpdateUserInput {
    username: String
    email: String
    age: Int
  } 
`;
