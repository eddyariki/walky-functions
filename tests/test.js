const assert = require("assert");
const firebase = require("@firebase/testing");



const MY_PROJECT_ID = "pedometer-develop";
const myId = "user_uid_abc";
const theirId = "user_uid_dxy";
const myAuth = {uid: myId, email: "abc@gmail.com"}

function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore()
}

describe("Our social app",  ()=>{

     it("Can read items in the read-only users collection", async ()=>{
         const db = getFirestore(null);
         const testDoc = db.collection("users").doc("testDoc");
         await firebase.assertSucceeds(testDoc.get());
     })

     it("Can't write items in the read-only users collection", async() =>{
         const db = getFirestore(null);
         const testDoc = db.collection("users").doc("testDoc");
         await firebase.assertFails(testDoc.set({foo:"bar"}))
     })

     it("Can write to an incoming_user_changes document with the same ID as our user", async() =>{
         const db = getFirestore(myAuth);
         const testDoc = db.collection("incoming_user_changes").doc(myId);
         await firebase.assertSucceeds(testDoc.set({uid:myId}))
     })

     it("Can't write to an incoming_user_changes document with a different ID as our user", async() =>{
        const db = getFirestore(myAuth);
        const testDoc = db.collection("incoming_user_changes").doc(theirId);
        await firebase.assertFails(testDoc.set({uid:theirId}))
    })
})