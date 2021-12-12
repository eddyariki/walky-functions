import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const createNewUser = functions.auth.user().onCreate((user) => {
  const {uid, phoneNumber} = user;
  const account = {
    uid,
    phoneNumber,
    name: null,
    birthday: null,
    age: null,
    weight: null,
  };
  functions.logger.log("user created", account.uid, account.phoneNumber);
  return admin.firestore().collection("users").doc(uid).set(account);
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  const {uid} = user;
  functions.logger.log("user deleted", uid);
  await admin.firestore().collection("users").doc(uid).delete();
  return admin
      .firestore()
      .collection("incoming_user_changes")
      .doc(uid)
      .delete();
});

