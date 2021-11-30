import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {app, server} from "./test";

admin.initializeApp();

exports.createNewUser = functions.auth.user().onCreate((user) => {
  const {uid, email, displayName} = user;
  const account = {
    uid,
    email,
    displayName,
    birthday: null,
    age: null,
    weight: null,
  };
  functions.logger.log("user created", account.email, account.uid);
  return admin.firestore().collection("users").doc(uid).set(account);
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
  const {uid} = user;

  functions.logger.log("user deleted", user.email, uid);
  return admin.firestore().collection("users").doc(uid).delete();
});

exports.updateUser = functions.firestore
    .document("incoming_user_changes/{docId}")
    .onCreate((snap) => {
      const original = snap.data();
      const {uid, displayName, birthday, age, weight} = original;
      functions.logger.log(
          "incoming user changes",
          uid,
          displayName,
          birthday,
          age,
          weight
      );

      return admin.firestore().collection("users").doc(uid).update({
        displayName,
        birthday,
        age,
        weight,
      });
    });

exports.deleteUserChanges = functions.firestore
    .document("users/{userId}")
    .onUpdate((snap, context) => {
    // return admin
    //     .database()
    //     .ref("/other")
    //     .orderByChild("id")
    //     .equalTo(context.params.pushId)
    //     .once("value")
    //     .then((snapshot) => {});

      return admin.firestore().collection("incoming_user_changes").doc();
    });

server
    .start()
    .then(() => {
      server.applyMiddleware({app, path: "/"});
    })
    .catch((e) => {
      console.log("weird");
    });

exports.graphql = functions.https.onRequest(app);
