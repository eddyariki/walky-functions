import * as admin from "firebase-admin";
// import {generateUid} from "./lib/generateUid";
import {updateUser} from "./resolvers/updateUser";
export const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
    async getUser(_:null, {uid}: {uid: string}) {
      const user = await admin.firestore().collection("users").doc(uid).get();
      return user.data();
    },
  },
  Mutation: {
    // eslint-disable-next-line max-len
    updateUser,
  },
};
