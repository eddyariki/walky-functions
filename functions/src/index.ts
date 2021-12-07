import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {ApolloServer} from "apollo-server-express";
import {resolvers} from "./resolver";
import {typeDefs} from "./typeDefs";
import express from "express";

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

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server
    .start()
    .then(() => {
      server.applyMiddleware({app, path: "/"});
    })
    .catch((e) => {
      functions.logger.error("error", e);
    });

exports.graphql = functions.https.onRequest(app);
