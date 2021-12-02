import {gql} from "apollo-server-cloud-functions";
import {DocumentNode} from "graphql";

export const typeDefs: DocumentNode = gql`
  type Query {
    users: [User]
  }

  type Mutation {
    addTest(text: String!): Test
    updateUser(
      uid: ID!
      displayName: String!
      age: String
      birthday: String
      weight: String!
    ): User
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
