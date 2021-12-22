import * as admin from "firebase-admin";
import {validateFirebaseIdToken} from "../helpers";
import {ExpressContext} from "apollo-server-express";

// export const rejectFriend = async (
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

//   await admin
//       .firestore()
//       .collection("users")
//       .doc(reqUser.uid)
//       .collection("friends")
//       .doc(reqUser.uid)
//       .set({
//         pendingFriends: admin.firestore
//             .FieldValue
//             .arrayRemove(friendUid),
//       });
//   return friendUid;
// };


export const rejectFriend = async (
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

  await admin
      .firestore()
      .collection("users")
      .doc(reqUser.uid)
      .collection("pending_friends")
      .doc(friendUid)
      .delete();
  return friendUid;
};
