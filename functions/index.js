const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//-----------------Send givers notifications whenever somebody nears them needs some money
exports.sendGiverNotification = functions.database.ref('/notify/{randomID}').onCreate(event=> {


  var data = event.data.val();
  const randomID = event.params.randomID;
  const uid = data.giverID;
  console.log("uid is: ", uid);
  const userPromise = admin.database().ref(`Users/${uid}`).once('value');

  Promise.all([userPromise]).then(res=> {
    const userData = res[0].val();
    console.log('userData is: ', userData);
    const messageToken = userData.messageToken;
    console.log('messaging token is ', messageToken);

    const payload = {
      notification: {
        title: '¢ashMe',
        body: 'Time to make money! Someone near you needs cash!',
        sound: 'default'
      },
      data: {
        amount: String(data.amount),
        displayName: data.displayName,
        distance: String(data.distance),
        giverID: data.giverID,
        rating: String(data.rating),
        requestID: data.requestID

      }
    }

    console.log("THE GODDAMN DATA THAT WILL BE PASSED: ", data);
    console.log ("THE GODDAMN NOTIFICATION", payload);


    if (messageToken){
      admin.messaging().sendToDevice(messageToken, payload)
        .then(function(response){
          console.log("Successfully sent message!");
          const ref = admin.database().ref(`notify/${randomID}`);
          ref.remove();
        })
        .catch(function(err){
          console.log("Error sending message", err);
        })
    }


  })
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
