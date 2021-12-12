import * as admin from "firebase-admin";
// import {generateUid} from "./lib/generateUid";
import {registerUser} from "./resolvers/updateUser";
export const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
  },
  Mutation: {
    // eslint-disable-next-line max-len
    registerUser,
  },
};
