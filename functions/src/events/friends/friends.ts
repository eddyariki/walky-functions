import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// when a user accepts a friend request
// they should create a document in
// incoming_friend_accept in order
// for RDB events to process changes
// on both users


// values ={
//     uid
//     friendUid,
// }

// make rules for this so only proper users can create it
export const acceptFriend = functions
    .firestore
    .document("incoming_friend_accept/{docId}")
    .onCreate(async (snap, context)=>{
      const values = snap.data();
      const docId = context.params.docId;
      const usersRef =admin
          .firestore()
          .collection("users");

      const userFriendsRef = usersRef
          .doc(values.uid)
          .collection("friends")
          .doc(values.uid);

      const doc = await userFriendsRef.get();
      // check to make sure friend has actually requested to be added
      if (doc.data()?.pendingFriends.includes(values.uid)) {
        await userFriendsRef.set({
          friendsList: admin
              .firestore
              .FieldValue
              .arrayUnion(values.friendUid),
          pendingFriends: admin
              .firestore
              .FieldValue
              .arrayRemove(values.friendUid),
        });
        const friendsFriendsRef = usersRef
            .doc(values.friendUid)
            .collection("friends")
            .doc(values.friendUid);
        await friendsFriendsRef.set({
          friendsList: admin
              .firestore
              .FieldValue
              .arrayUnion(values.uid),
        });
      }
      return admin
          .firestore()
          .collection("incoming_friend_accept")
          .doc(docId)
          .delete();
    });
