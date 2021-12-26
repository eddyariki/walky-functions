import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {ApolloServer, ExpressContext} from "apollo-server-express";
import {resolvers} from "./resolver";
import {typeDefs} from "./typeDefs";
import express from "express";
import {createNewUser, deleteUser} from "./events/auth/auth";
import {acceptFriendEvent} from "./events/friends/friends";
import {generateThumbnail} from "./events/storage/icon";


admin.initializeApp();

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: (e:ExpressContext) => e,
});

server
    .start()
    .then(() => {
      server.applyMiddleware({app, path: "/"});
    })
    .catch((e) => {
      console.log("error", e);
    });

exports.graphql = functions.https.onRequest(app);

exports.createNewUser = createNewUser;

exports.deleteUser = deleteUser;

exports.acceptFriendEvent = acceptFriendEvent;

exports.generateThumbnail = generateThumbnail;
