import {gql} from "apollo-server-express";
import {DocumentNode} from "graphql";

export const typeDefs: DocumentNode = gql`
  type Query {
    users: [User]
  }

  type Mutation {
    registerUser(uid: ID!, name: String!, phone: String!): User
  }

  type User {
    uid: ID!
    name: String!
    phone: String!
  }
`;
