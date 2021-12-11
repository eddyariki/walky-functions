import * as admin from "firebase-admin";
// import {generateUid} from "./lib/generateUid";

export const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
  },
  Mutation: {

    // eslint-disable-next-line max-len
    registerUser: async (_: null, {uid, phone, name}: {uid: string, phone: string, name: string}) => {
      await admin.firestore().collection("users").doc(uid).set({
        uid: uid,
        phone: phone,
        name: name,
      });
      const userRef = await admin.firestore().doc(`users/${uid}`).get();
      const user = await userRef.data();
      return user;
    },

    // updateUser: async (
    //     _: null,
    //     {
    //       uid,
    //       displayName,
    //       age,
    //       birthday,
    //       weight,
    //     }: {
    //     uid: string;
    //     displayName?: string;
    //     age?: string;
    //     birthday?: string;
    //     weight?: string;
    //   }
    // ): Promise<User> => {
    // eslint-disable-next-line max-len
    //   await admin.firestore().collection("incoming_user_changes").doc(uid).set({
    //     displayName,
    //     age,
    //     birthday,
    //     weight,
    //   });
    //   return {uid, age, birthday, weight};
    // },
  },
};
