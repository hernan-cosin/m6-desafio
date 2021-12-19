import * as express from "express";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import { nanoid } from "nanoid";
import { state } from "../client/state";
import map from "lodash/map";
import firebase from "firebase";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

app.get("/env-vars", (req, res) => {
  res.status(202).json({
    port: port,
    enviroment: process.env.NODE_ENV,
    test: true,
  });
});

// creates an user in firestore db and returns its ID. if already exist returns "user already exist"
app.post("/signin", (req, res) => {
  const { name } = req.body;

  usersCollection
    .where("name", "==", name)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        usersCollection
          .add({
            name,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        usersCollection
          .where("name", "==", name)
          .get()
          .then((searchResponse) => {
            searchResponse.forEach((e) => {
              res.json({ id: e.ref.path.slice(6), new: false });
            });
          });
        // res.status(400).json({
        //   message: "User already exist.",

        // });
      }
    });
});

// checks if the user ID provided exist, if true creates a room in firestore rtdb
// in firestore db creates a short room ID, and inside the long room ID from the firestore rtdb
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  const { name } = req.body;

  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("/rooms/" + nanoid());

        roomRef
          .set({
            "current-game": [
              {
                name: name,
                userId: userId,
                online: true,
                player: 0,
              },
            ],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = generateRoomId();

            roomsCollection
              .doc(roomId.toString())
              .set({
                history: [],
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "no existís",
        });
      }
    });
});

// checks if user ID exists, if true creates a reference to the room ID provided and pushes information of second player
app.post("/rooms/access", (req, res) => {
  const { userId } = req.body;
  const { name } = req.body;
  const { roomId } = req.body;

  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("/rooms/" + roomId + "/current-game");
        // roomRef.get().then((snap) => {
        //   console.log(snap.val());
        // });
        // if (snap.val().length == 1) {
        roomRef
          .update({
            1: {
              name: name,
              userId: userId,
              online: true,
              player: 1,
            },
          })
          .then(() => {
            // res.json({ key: roomRef.push().key });
            res.status(201).json({ message: "ok" });
          });
        // }
        // if (snap.val().length == 2) {
        //   const names = [];
        //   for (const u of snap.val()) {
        //     names.push(u.name);
        //   }
        // console.log(names);
        // if (name == names[0] || name == names[1]) {
        //   res.json({
        //     validPlayer: true,
        //   });
        // } else {
        //   res.json({
        //     validPlayer: false,
        //   });
        // }
        // }
        // });
        // roomRef.on("value", (snap) => {
        //   for (const u of snap.val()) {
        //     names.push(u.name);
        //   }

        //   for (const n of names) {
        //     console.log(n == name);
        //   }
        //   if (name !== names[0] || name !== names[1]) {
        //     res.json({
        //       message: "el nombre no coincide con un jugador en esta sala",
        //     });
        //   } else {
        //     roomRef
        //       .update({
        //         1: {
        //           name: name,
        //           userId: userId,
        //           online: true,
        //           player: 1,
        //         },
        //       })
        //       .then(() => {
        //         res.json({ key: roomRef.push().key });
        //       });
        //   }
        // });

        // roomRef
        //   .update({
        //     1: {
        //       name: name,
        //       userId: userId,
        //       online: true,
        //       player: 1,
        //     },
        //   })
        //   .then(() => {
        //     res.json({ key: roomRef.push().key });
        //   });
      } else {
        res.status(401).json({
          message: "No existís",
        });
      }
    });
});

// recibes userID and roomID, if user exist returns data from rtdb room ID in firestore db
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  // res.json({ userId });

  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsCollection
          .doc(roomId.toString())
          .get()
          .then((snap) => {
            const data = snap.data();
            // console.log(data);

            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existís",
        });
      }
    });
});

// set the start item in RTDB to true
app.post("/rooms/start", (req, res) => {
  const { roomId } = req.body;
  const { player } = req.body;
  const { start } = req.body;

  const roomRef = rtdb.ref("/rooms/" + roomId + "/current-game" + "/" + player);
  roomRef
    .update({
      start: start,
    })
    .then(() => {
      res.json({ update: true });
    });
});

// set the selected choice in the RTDB
app.post("/game/choice", (req, res) => {
  const { roomId } = req.body;
  const { player } = req.body;
  const { choice } = req.body;
  // const { shortId } = req.body;

  const roomRef = rtdb.ref("/rooms/" + roomId + "/current-game" + "/" + player);
  roomRef
    .update({
      choice: choice,
    })
    // .then(() => {
    // const roomRefCurrentGame = rtdb.ref("/rooms/" + roomId + "/current-game");
    // roomRefCurrentGame.get().then((data) => {
    //   const info = data.val();
    //   // console.log(info);
    //   const mapeado = info.map((p) => {
    //     return { [p.player]: p.choice };
    //   });
    //   // console.log(mapeado);
    //   roomsCollection
    //     .doc(shortId.toString())
    //     .set({ mapeado }, { merge: true });
    // });
    // roomsCollection
    //   .doc(shortId.toString())
    //   .update({
    //     history: [
    //       {
    //         [player]: choice,
    //       },
    //     ],
    // })
    .then(() => {
      res.json({
        message: "choice updated in rtdb",
      });
    });
});
// });

app.post("/rooms/choice", (req, res) => {
  const { roomId } = req.body;
  let { history } = req.body;
  // const { player } = req.body;
  // console.log(history);
  roomsCollection
    .doc(roomId.toString())
    .get()
    .then((resp) => {
      // const historyFromFirestore = resp.data().history;

      // historyFromFirestore.push(history[0]);
      // console.log(historyFromFirestore);

      roomsCollection
        .doc(roomId.toString())
        .get()
        .then((snap) => {
          const data = snap.data();
          // console.log("data history", data.history);
          // console.log("history from body", history);
          history.push(...data.history);
          // console.log("history modified", history);

          // data.push(history[0]);
          roomsCollection
            .doc(roomId.toString())
            .set({ history }, { merge: true });
        });
      //   .set({ historyFromFirestore }, { merge: true });
      // const history = resp.data().history;

      // history.push(history[0]);

      // roomsCollection.doc(roomId.toString()).set({ history }, { merge: true });
      // }history
    })

    // roomsCollection
    //   .doc(roomId.toString())
    //   .set({ history }, { merge: true })
    // .get()
    // .then((resp) => {
    // console.log(resp.data().history == undefined);
    // console.log(resp.data().history);
    // console.log(resp.data().history.length);
    // console.log(resp.data().history[0]);
    // console.log(resp.data().history[resp.data().history.length - 1]);
    // console.log(resp.data().history[resp.data().history.length - 1][0]);
    // console.log(resp.data().history[resp.data().history.length - 1][1]);
    // console.log(resp.data().history[resp.data().history.length]);
    // console.log(resp.data().history[resp.data().length]);

    // console.log(resp.data().history[resp.data().history.length - 1][0]);
    // console.log(resp.data().history[resp.data().history.length - 1][1]);
    // console.log(resp.data().history[resp.data().history.length - 1][2]);
    // if (resp.data().history == undefined) {
    // roomsCollection.doc(roomId.toString()).update({
    //   history: [
    //     {
    //       [player]: choice,
    //     },
    //   ],
    // });
    // }
    // if (resp.data().history[resp.data().history.length - 1][1] == undefined) {
    //   roomsCollection.doc(roomId.toString()).set({
    //     history: [
    //       {
    //         [player]: choice,
    //       },
    //     ],
    // });
    // resp.data().history[resp.data().history.length - 1][0].update({
    //   [player]: choice,
    // });
    // resp.data().history[].update({
    //   [player]: choice,
    // });
    // }
    // if (resp.data().history[resp.data().history.length - 1][1] == undefined) {
    //   resp.data().history[resp.data().history.length - 1].update({
    //     [player]: choice,
    //   });
    // }
    // const history = resp.data().history;
    // console.log("history", history);
    // console.log("history length", history.length);
    // console.log("history[0]", history[0]);

    // history[history.length - 1] = {
    //   ...history[history.length - 1],
    //   [player]: choice,
    // };
    // console.log(history);
    // roomsCollection.doc(roomId.toString()).update({ history });
    // if (resp.data().history.length > 0) {
    //   const lastHistory = resp.data().history;
    //   lastHistory[lastHistory.length - 1].push(player + ":" + choice);
    //   roomsCollection.doc(roomId.toString()).update({ lastHistory });
    // }
    // })
    // .then(() => {
    // .update({
    //   history: [
    //     {
    //       [player]: choice,
    //     },
    //   ],
    // })
    // })
    .then(() => {
      res.json({
        message: "choice updated in firestore",
        // id: roomId.toString(),
      });
    });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});

function generateRoomId() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomCharacter2 =
    alphabet[Math.floor(Math.random() * alphabet.length)];

  const randomNumber = Math.floor(Math.random() * 99);
  const randomNumber2 = Math.floor(Math.random() * 99);

  if (randomNumber < 10) {
    randomNumber + 10;
  }
  if (randomNumber > 99) {
    randomNumber - 20;
  }
  if (randomNumber2 < 10) {
    randomNumber + 10;
  }
  if (randomNumber2 > 99) {
    randomNumber - 20;
  }

  const roomId =
    randomNumber + randomCharacter + randomCharacter2 + randomNumber2;
  return roomId;
}
