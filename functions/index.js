const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//-----------------Send givers notifications whenever somebody nears them needs some money
exports.sendGiverNotification = functions.database.ref('/notify/{randomID}').onCreate(event=> {


  const data = event.data.val();
  const uid = data.giverID;
  const userPromise = admin.database().ref(`Users/${uid}`).once('value');

  Promise.all([userPromise]).then(res=> {
    const userData = res[0].val();
    const messageToken = userData.messageToken;
    console.log('messaging token is ', messageToken);

    const payload = {
      notification: {
        title: '¢ashMe',
        body: 'Time to make money! Someone near you needs cash!',
        sound: 'default'
      }
    }
    payload.data = data;

    if (messageToken){
      admin.messaging().sendToDevice(messageToken, payload)
        .then(function(response){
          console.log("Successfully sent message!");
          const ref = admin.database().ref(`notify/${uid}`);
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
