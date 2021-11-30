import {gql} from "apollo-server-cloud-functions";
import {DocumentNode} from "graphql";

export const typeDefs: DocumentNode = gql`
  type Query {
    users: [User]
  }

  type Mutation {
    addTest(text: String!): Test
  }

  type User {
    age: String
    birthday: String
    name: String!
    displayName: String!
    email: String!
    uid: ID!
    weight: String!
  }

  type Test {
    uid: ID!
    text: String!
  }
`;
