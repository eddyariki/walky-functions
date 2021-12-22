import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// when a user accepts a friend request
// they should create a document in
// incoming_friend_accept in order
// for RDB events to process changes
// on both users


// make rules for this so only proper users can create it
// export const acceptFriendEvent = functions
//     .firestore
//     .document("incoming_friend_accept/{docId}")
//     .onCreate(async (snap, context)=>{
//       const values = snap.data();
//       const docId = context.params.docId;
//       functions.logger.log(docId);
//       functions.logger.log(values);
//       //   const doc = await userFriendsRef.get();
//       // check to make sure friend has actually requested to be added
//       const friendsRef = await admin.firestore().collection("users")
//           .doc(values.uid)
//           .collection("friends")
//           .doc(values.uid)
//           .get();
//       if (friendsRef?.data()?.pendingFriends.includes(values.friendUid)) {
//         // change self's friendlist
//         await admin.firestore().collection("users")
//             .doc(values.uid)
//             .collection("friends")
//             .doc(values.uid)
//             .set({
//               friendsList: admin
//                   .firestore
//                   .FieldValue
//                   .arrayUnion(values.friendUid),
//               pendingFriends: admin
//                   .firestore
//                   .FieldValue
//                   .arrayRemove(values.friendUid),
//             });

//         await admin.firestore().collection("users")
//             .doc(values.friendUid).collection("friends")
//             .doc(values.friendUid).set({
//               friendsList: admin
//                   .firestore
//                   .FieldValue
//                   .arrayUnion(values.uid),
//             });
//         return admin
//             .firestore()
//             .collection("incoming_friend_accept")
//             .doc(docId)
//             .delete();
//       } else {
//         functions.logger.error("friend not in pendingFriends");
//         return;
//       }
//     });


export const acceptFriendEvent = functions
    .firestore
    .document("incoming_friend_accept/{docId}")
    .onCreate(async (snap, context)=>{
      const values = snap.data();
      const docId = context.params.docId;
      functions.logger.log(docId);
      functions.logger.log(values);
      //   const doc = await userFriendsRef.get();
      // check to make sure friend has actually requested to be added
      const friendsRef = await admin.firestore().collection("users")
          .doc(values.uid)
          .collection("pending_friends")
          .doc(values.friendUid)
          .get();
      if (friendsRef) {
        // change self's friendlist
        await admin.firestore().collection("users")
            .doc(values.uid)
            .collection("pending_friends")
            .doc(values.friendUid)
            .delete();
        await admin.firestore().collection("users")
            .doc(values.uid)
            .collection("friends")
            .doc(values.friendUid)
            .set({
              friendUid: values.friendUid,
            });

        await admin.firestore().collection("users")
            .doc(values.friendUid).collection("friends")
            .doc(values.uid).set({
              friendUid: values.uid,
            });
        return admin
            .firestore()
            .collection("incoming_friend_accept")
            .doc(docId)
            .delete();
      } else {
        functions.logger.error("friend not in pendingFriends");
        return;
      }
    });
