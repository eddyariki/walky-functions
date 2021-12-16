import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {AuthenticationError, ExpressContext} from "apollo-server-express";
import * as functions from "firebase-functions";
import {sleep} from "../lib/sleep";

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
    try {
      await sleep(1);
      await admin.firestore().collection("users").doc(uid).update({
        name: name,
        age: age,
        weight: weight,
      });
      const userRef = await admin.firestore().doc(`users/${uid}`).get();
      const user = await userRef.data();
      return user;
    } catch (e) {
      functions.logger.log(e);
      throw new Error;
    }
  } else {
    throw new AuthenticationError("unauthorized");
  }
};
