const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//-----------------Send givers notifications whenever somebody nears them needs some money
exports.sendGiverNotification = functions.database.ref('/notify/{uid}').onCreate(event=> {
  const uid = event.params.uid;
  const userPromise = admin.database().ref(`Users/${uid}`).once('value');
  console.log("THE EVENT", event);
  console.log("THE NEW DATA", event.data);
  console.log("THE NEW DATA", event.DeltaSnapshot);

  Promise.all([userPromise]).then(res=> {
    const userData = res[0].val();
    const messageToken = userData.messageToken;
    console.log('messaging token is ', messageToken);

    const payload = {
      notification: {
        title: '¢ashMe',
        body: 'Time to make money! Someone near you needs cash!',
        sound: 'default'
      },
      data: {
        //@Michael: input whatever data you need in here
      }
    }

    admin.messaging().sendToDevice(messageToken, payload)
      .then(function(response){
        console.log("Successfully sent message!");
        const ref = admin.database().ref(`notify/${uid}`);
        ref.remove();
      })
      .catch(function(err){
        console.log("Error sending message", err);
      })
  })
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
