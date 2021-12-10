import {gql} from "apollo-server-cloud-functions";
import {DocumentNode} from "graphql";

export const typeDefs: DocumentNode = gql`
  type Query {
    users: [User]
  }

  type Mutation {
    registerUser(uid: ID!, name: String!, phone: String!): User
  }

  type User {
<<<<<<< HEAD
    age: String
    birthday: String
    name: String!
    displayName: String!
=======
>>>>>>> 7f06c7191a3e15b32f061172a4170f8b027d9235
    uid: ID!
    name: String!
    phone: String!
  }
`;
