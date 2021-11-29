import {ApolloServer, gql} from "apollo-server-cloud-functions";
import * as admin from "firebase-admin";

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

export const server = new ApolloServer({typeDefs, resolvers});
