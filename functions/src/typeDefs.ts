import {gql} from "apollo-server-express";
import {DocumentNode} from "graphql";

export const typeDefs: DocumentNode = gql`
  type Query {
    users: [User]
  }

  type Mutation {
    updateUser(
      uid: ID!, 
      name: String, 
      age:  Int,
      weight: Float, 
      ): User
  }

  type User {
    uid: ID!
    phoneNumber: String!
    name: String
    age: Int,
    weight: Float,
  }
`;
