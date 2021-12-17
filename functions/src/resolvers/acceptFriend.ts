import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {ApolloError, ExpressContext} from "apollo-server-express";

export const acceptFriend = async (
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
    await admin
        .firestore()
        .collection("incoming_friend_accept")
        .doc(reqUser.uid)
        .create({
          uid: reqUser.uid,
          friendUid,
        });
    return friendUid;
  } else {
    throw new ApolloError("server error");
  }
};
