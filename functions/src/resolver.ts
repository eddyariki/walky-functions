import * as admin from "firebase-admin";
// import {generateUid} from "./lib/generateUid";
import {updateUser} from "./resolvers/updateUser";
import {addFriend} from "./resolvers/addFriend";
import {rejectFriend} from "./resolvers/rejectFriend";
import {acceptFriend} from "./resolvers/acceptFriend";
export const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection("users").get();
      return users.docs.map((user) => user.data());
    },
  },
  Mutation: {
    // eslint-disable-next-line max-len
    addFriend,
    rejectFriend,
    acceptFriend,
    updateUser,
  },
};
