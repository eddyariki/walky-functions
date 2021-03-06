import {gql} from "apollo-server-express";
import {DocumentNode} from "graphql";

export const typeDefs: DocumentNode = gql`
  type Query {
    users: [User]
    getUser(uid: ID!): User
  }

  type Mutation {
    updateUser(
      uid: ID!, 
      name: String, 
      age:  Int,
      weight: Float,
      userCode: String,
      ): User

      acceptFriend(
        friendUid: ID!
      ): ID

      addFriend(
        friendUid: ID!
      ): ID

      rejectFriend(
        friendUid: ID!
      ): ID

  }

  type User {
    uid: ID!
    phoneNumber: String!
    name: String
    age: Int,
    weight: Float,
    userCode: String,
    icon: String,
  }
`;
