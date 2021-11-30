import {ApolloServer, gql} from "apollo-server-express";
import express from "express";
import * as admin from "firebase-admin";

export const app = express();
const typeDefs = gql`
  type Query {
    users: [User]
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
`;

const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
  },
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});
