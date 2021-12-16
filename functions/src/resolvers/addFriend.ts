import * as admin from "firebase-admin";
// import {validateFirebaseIdToken} from "../helpers";
import {ExpressContext} from "apollo-server-express";
// worked
export const addFriend = async (
    _: null,
    {
      friendUid, // friend's uid
      uid,
    }
      :
      {
        friendUid: string,
        uid:string
      },
    context: ExpressContext
):Promise<string | undefined> => {
  // const reqUser = await validateFirebaseIdToken(context);
  // if (friendUid !== reqUser.uid) {
  await admin
      .firestore()
      .collection("users")
      .doc(friendUid)
      .collection("friends")
      .doc(friendUid)
      .set({
        pendingFriends: admin.firestore
            .FieldValue
            .arrayUnion(uid),
      });
  return friendUid;
  // } else {
  //   throw new ApolloError("server error");
  // }
};
