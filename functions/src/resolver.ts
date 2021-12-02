import * as admin from "firebase-admin";
import {generateUid} from "./lib/generateUid";

export const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
  },
  Mutation: {
    addTest: async (_: null, {text}: { text: string }) => {
      const uid = generateUid();
      await admin.firestore().collection("test").doc(uid).set({
        uid: uid,
        text: text,
      });
      const testDoc = await admin.firestore().doc(`test/${uid}`).get();
      const test = await testDoc.data();
      return test;
    },

    updateUser: async (
        _: null,
        {
          uid,
          displayName,
          age,
          birthday,
          weight,
        }: {
        uid: string;
        displayName?: string;
        age?: string;
        birthday?: string;
        weight?: string;
      }
    ): Promise<User | undefined> => {
      await admin.firestore().collection("incoming_user_changes").doc(uid).set({
        displayName,
        age,
        birthday,
        weight,
      });
      return {uid, displayName, age, birthday, weight};
    },
  },
};
