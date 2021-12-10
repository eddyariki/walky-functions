import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {ApolloServer} from "apollo-server-express";
import {typeDefs} from "./typeDefs";
import express from "express";
import {resolvers} from "./resolver";
import {firestore} from "firebase-admin";

admin.initializeApp();

exports.createNewUser = functions.auth.user().onCreate((user) => {
  const {uid, displayName, phoneNumber} = user;
  const account = {
    uid,
    displayName,
    phoneNumber,
    birthday: null,
    age: null,
    weight: null,
  };
  functions.logger.log("user created", account.phoneNumber, account.uid);
  return admin.firestore().collection("users").doc(uid).set(account);
});

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const {uid} = user;
  await admin.firestore().collection("users").doc(uid).delete();
});

exports.updateUser = functions.firestore
    .document("incoming_user_changes/{docId}")
    .onCreate(async (snap, context) => {
      const original = snap.data();
      const docId = context.params.docId;
      const ref = await admin.firestore().collection("users").doc(docId).get();
      if (!ref.exists) {
        functions.logger.log("user does not exist");
        return admin
            .firestore()
            .collection("incoming_user_changes")
            .doc(docId)
            .delete();
      } else {
        const {displayName, birthday, age, weight} = original;
        functions.logger.log(
            "incoming user changes",
            docId,
            displayName,
            birthday,
            age,
            weight
        );

        await admin.firestore().collection("users").doc(docId).update({
          displayName,
          birthday,
          age,
          weight,
        });
        return admin
            .firestore()
            .collection("incoming_user_changes")
            .doc(docId)
            .delete();
      }
    });

exports.addFriend = functions.firestore
    .document("incoming_friend_request/{docId}")
    .onCreate(async (snap, context)=> {
      const data = snap.data();
      const docId = context.params.docId;
      const ref = await admin.firestore()
          .collection("users")
          .doc(data.friendUid)
          .get();
      if (!ref.exists) {
        functions.logger.log("user does not exist");
        return admin
            .firestore()
            .collection("incoming_friend_request")
            .doc(docId)
            .delete();
      }
      // append caller's uid into friend's requests
      await admin.firestore()
          .collection("users")
          .doc(data.friendUid)
          .update({
            friendRequests: admin.firestore
                .FieldValue
                .arrayUnion(data.uid),
          });
      return admin
          .firestore()
          .collection("incoming_friend_request")
          .doc(docId)
          .delete();
    });

// update caller ("person who accepts friend request")
// update requester
exports.approveFriend = functions.firestore
    .document("incoming_approve_friend/{docId}")
    .onCreate(async (snap, context) =>{
      const data = snap.data();
      const docId = context.params.docId;
      const ref = await admin.firestore()
          .collection("users")
          .doc(data.friendUid)
          .get();
      if (!ref.exists) {
        functions.logger.log("user does not exist");
        return admin
            .firestore()
            .collection("incoming_friend_request")
            .doc(docId)
            .delete();
      }
      // remove friend's id from requests
      await admin.firestore()
          .collection("users")
          .doc(data.uid)
          .update({
            friendRequests: admin.firestore
                .FieldValue
                .arrayRemove(data.friendUid),
          });
      await admin.firestore()
          .collection("users")
          .doc(data.uid)
          .update({
            friends: admin.firestore
                .FieldValue
                .arrayUnion(data.friendUid),
          });
      // append caller's uid into friend's requests
      return admin.firestore()
          .collection("users")
          .doc(data.friendUid)
          .update({
            friends: admin.firestore
                .FieldValue
                .arrayUnion(data.uid),
          });
    });

exports.rejectFriend = functions.firestore
    .document("incoming_reject_friend/{docId}")
    .onCreate(async (snap, context) =>{
      const data = snap.data();
      const docId = context.params.docId;
      // remove friend's id from requests
      return admin.firestore()
          .collection("users")
          .doc(data.uid)
          .update({
            friendRequests: admin.firestore
                .FieldValue
                .arrayRemove(data.friendUid),
          });
    });

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});
(async () => {
  await server.start();
  server.applyMiddleware({app, path: "/"});
  exports.graphql = functions.https.onRequest(app);
})();


