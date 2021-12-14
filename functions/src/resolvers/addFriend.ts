import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {ApolloError, ExpressContext} from "apollo-server-express";

export const addFriend = async (
    _: null,
    {
      friendUid, // friend's uid
    }
      :
      {
        friendUid: string,
      },
    context: ExpressContext
):Promise<string | undefined> => {
  const reqUser = await validateFirebaseIdToken(context);
  if (friendUid !== reqUser.uid) {
    await admin.firestore().collection("users").doc(friendUid).set({
      pendingFriends: admin.firestore
          .FieldValue
          .arrayUnion(reqUser.uid),
    });
    return friendUid;
  } else {
    throw new ApolloError("server error");
  }
};
