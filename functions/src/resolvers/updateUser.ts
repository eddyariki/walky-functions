import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {AuthenticationError, ExpressContext} from "apollo-server-express";

export const updateUser = async (
    _: null,
    {
      uid,
      name,
      age,
      weight,
    }
      :
      {
        uid: string,
        name?: string,
        age? : number,
        weight?: number
      },
    context: ExpressContext
):Promise<FirebaseFirestore.DocumentData | undefined> => {
  const reqUser = await validateFirebaseIdToken(context);
  if (uid === reqUser.uid) {
    await admin.firestore().collection("users").doc(uid).set({
      name,
      age,
      weight,
    });
    const userRef = await admin.firestore().doc(`users/${uid}`).get();
    const user = await userRef.data();
    return user;
  } else {
    throw new AuthenticationError("unauthorized");
  }
};
