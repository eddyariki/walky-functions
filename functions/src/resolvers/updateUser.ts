import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {ExpressContext} from "apollo-server-express";

export const updateUser = async (
    _: null,
    {uid, name}: {uid: string, name: string},
    context: ExpressContext
):Promise<FirebaseFirestore.DocumentData | undefined> => {
  await validateFirebaseIdToken(context);
  await admin.firestore().collection("users").doc(uid).set({
    name: name,
  });
  const userRef = await admin.firestore().doc(`users/${uid}`).get();
  const user = await userRef.data();
  return user;
};
