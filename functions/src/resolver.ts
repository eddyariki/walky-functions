import {ApolloServer, gql} from "apollo-server-cloud-functions";
import * as admin from "firebase-admin";
import {typeDefs} from "./typeDefs";
import {generateUid} from "./lib/generateUid";

export const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
  },
  Mutation: {
    addTest: async (_: null, {text}: {text: string}) => {
      const uid = generateUid();
      await admin.firestore().collection("test").doc(uid).set({
        uid: uid,
        text: text,
      });
      const testDoc = await admin.firestore().doc(`test/${uid}`).get();
      const test = await testDoc.data();
      return test;
    },
  },
};
