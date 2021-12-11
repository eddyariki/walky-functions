import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {ApolloServer} from "apollo-server-express";
import {typeDefs} from "./typeDefs";
import express from "express";
import {resolvers} from "./resolver";

admin.initializeApp({});

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

// // request to start a race
// exports.createRaceRequest = functions.firestore
//     .document("race_request/{docId}")
//     .onCreate(async (snap, context) => {
//       const original = snap.data();
//       const docId = context.params.docId;
//       const sender = original.senderUid;
//       const requestedUser = original.requestedUserUid;
//       const ref = await admin
//           .firestore()
//           .collection("users")
//           .doc(requestedUser)
//           .get();
//       if (!ref.exists) {
//         functions.logger.log("user does not exist");
//         return admin
//             .firestore()
//             .collection("race_request")
//             .doc(docId)
//             .delete();
//       } else {
//         const {location} = original;
//         functions.logger.log(
//             "race request created",
//             docId,
//             sender,
//             requestedUser,
//             location
//         );

//         await admin
//             .firestore()
//             .collection("users")
//             .doc(requestedUser)
//             .collection("race_requests")
//             .add({
//               docId: docId,
//               sender,
//               requestedUser,
//               location,
//             });
//         return await admin
//             .firestore()
//             .collection("users")
//             .doc(sender)
//             .collection("race_requests")
//             .add({
//               docId: docId,
//               sender,
//               requestedUser,
//               location,
//             });
//       }
//     });


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


