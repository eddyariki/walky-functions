import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {ApolloError, ExpressContext} from "apollo-server-express";
// worked
// export const addFriend = async (
//     _: null,
//     {
//       friendUid, // friend's uid

//     }
//       :
//       {
//         friendUid: string,
//       },
//     context: ExpressContext
// ):Promise<string | undefined> => {
//   const reqUser = await validateFirebaseIdToken(context);
//   if (friendUid !== reqUser.uid) {
//     await admin
//         .firestore()
//         .collection("users")
//         .doc(friendUid)
//         .collection("friends")
//         .doc(friendUid)
//         .set({
//           pendingFriends: admin.firestore
//               .FieldValue
//               .arrayUnion(reqUser.uid),
//         });
//     return friendUid;
//   } else {
//     throw new ApolloError("server error");
//   }
// };


// users/___/pending_friends/f___

export const addFriend = async (
    _: null,
    {
      friendUid, // friend's uid
    }
    :
    {
      friendUid: string,
    },
    context: ExpressContext
):Promise<string | undefined> => {
  const reqUser = await validateFirebaseIdToken(context);
  if (friendUid !== reqUser.uid) {
    await admin
        .firestore()
        .collection("users")
        .doc(friendUid)
        .collection("pending_friends")
        .doc(reqUser.uid)
        .set({friendUid: reqUser.uid});
    return friendUid;
  } else {
    throw new ApolloError("server error");
  }
};
