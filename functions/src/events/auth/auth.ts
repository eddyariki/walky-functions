import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const createNewUser = functions.auth.user().onCreate((user) => {
  const {uid, phoneNumber} = user;
  // phoneNumber should never be undefined if we only allow phone auth
  const account: User = {
    uid,
    phoneNumber: phoneNumber || "",
    name: null,
    age: null,
    weight: null,
    userCode: null,
    icon: null,
  };
  functions.logger.log("user created", account.uid, account.phoneNumber);
  return admin.firestore().collection("users").doc(uid).set(account);
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  const {uid} = user;
  functions.logger.log("user deleted", uid);
  return admin.firestore().collection("users").doc(uid).delete();
});

