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
  res.json({
    port: port,
    enviroment: process.env.NODE_ENV,
    test: true,
  });
});

// recives a name, if name exists in firestore db respond with id number and new: false.
// if there is no matching name in firestore db it creates a user and return its id number and new: true
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
      }
    });
});

// checks if the user ID provided exist, if true creates a room in firestore rtdb
// in firestore db creates a short room ID, and inside of it stores the long room ID from the firestore rtdb
// returns the firestore room ID
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
                choice: "",
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
        res.sendStatus(401).json({
          message: "no existís",
        });
      }
    });
});

// checks if user ID exists, if true checks if only one player in rtdb room
// and pushes player two
// if name in player two is not set yet and is equal to undefined pushes player two
// if there are two players and the name provided dosn't match any in the rtdb and also is not undefined
// returns match false, if matches returns match true
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

        roomRef.get().then((snapshot) => {
          if (snapshot.val().length == 1) {
            roomRef
              .update({
                1: {
                  choice: "",
                  name: name,
                  userId: userId,
                  online: true,
                  player: 1,
                },
              })
              .then(() => {
                res.json({ access: true });
              });
          }
          if (snapshot.val().length == 2) {
            if (snapshot.val()[1].name == undefined) {
              roomRef
                .update({
                  1: {
                    choice: "",
                    name: name,
                    userId: userId,
                    online: true,
                    player: 1,
                  },
                })
                .then(() => {
                  res.json({ access: true });
                });
            }
            if (
              name !== snapshot.val()[0].name &&
              name !== snapshot.val()[1].name &&
              snapshot.val()[1].name !== undefined
            ) {
              res.json({ match: false });
            } else if (
              name == snapshot.val()[0].name ||
              name == snapshot.val()[1].name
            ) {
              res.json({ match: true });
            }
          }
        });
      }
    });
});

// recibes userID and roomID, if user exist returns data from rtdb room ID in firestore db
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;

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

            res.json(data);
          });
      } else {
        res.sendStatus(401).json({
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

  const roomRef = rtdb.ref("/rooms/" + roomId + "/current-game" + "/" + player);
  roomRef
    .update({
      choice: choice,
    })
    .then(() => {
      res.json({
        message: "choice updated in rtdb",
      });
    });
});

// update the history in the firestore
app.post("/rooms/choice", (req, res) => {
  const { roomId } = req.body;
  let { historyFromFront } = req.body;

  roomsCollection
    .doc(roomId.toString())
    .get()
    .then(() => {
      roomsCollection
        .doc(roomId.toString())
        .get()
        .then((snap) => {
          const data = snap.data();
          let history = data.history;

          history.push(...historyFromFront);

          roomsCollection
            .doc(roomId.toString())
            .set({ history }, { merge: true });
        });
    })
    .then(() => {
      res.json({
        message: "choice updated in firestore",
      });
    });
});

// recives rtdbroomid from the state and the roomid corresponding to firestore
// and returns the history of that room
app.post("/rooms/history", (req, res) => {
  const { rtdbRoomId } = req.body;
  const { roomId } = req.body;

  roomsCollection
    .doc(roomId)
    .get()
    .then((snap) => {
      const data = snap.data();

      if (data.rtdbRoomId == rtdbRoomId) {
        if (data.history.length == 0) {
          roomsCollection
            .doc(roomId)
            .get()
            .then((snap) => {
              const data = snap.data();
              res.send(data.history);
            });
        } else {
          res.send(data.history);
        }
      }
    });
});

// recives a rtdbroomid and the number of the player and set the start to false and the choice to empty
app.post("/rtdb/reset/start-choice", (req, res) => {
  const { rtdbRoomId } = req.body;
  const { player } = req.body;

  const roomRef = rtdb.ref(
    "/rooms/" + rtdbRoomId + "/current-game" + "/" + player
  );
  roomRef.update({ choice: "", start: false }).then(() => {
    res.send("reset choice and start values: true");
  });
});

// recives a rtdbroomid and the number of the player and set the online to false
app.post("/rtdb/reset/online", (req, res) => {
  const { rtdbRoomId } = req.body;
  const { player } = req.body;

  const roomRef = rtdb.ref(
    "/rooms/" + rtdbRoomId + "/current-game" + "/" + player
  );
  roomRef.update({ online: false }).then(() => {
    res.send("reset online: true");
  });
});

// recives a rtdbroomid and the number of the player and set the online to false
app.post("/rtdb/set/online", (req, res) => {
  const { rtdbRoomId } = req.body;
  const { player } = req.body;

  const roomRef = rtdb.ref(
    "/rooms/" + rtdbRoomId + "/current-game" + "/" + player
  );
  roomRef.update({ online: true }).then(() => {
    res.send("set online: true");
  });
});

app.post("/rtdb/reset/start", (req, res) => {
  const { rtdbRoomId } = req.body;
  const { player } = req.body;

  const roomRef = rtdb.ref(
    "/rooms/" + rtdbRoomId + "/current-game" + "/" + player
  );
  roomRef.update({ start: false }).then(() => {
    res.send("reset start: true");
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

  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const randomNumber = getRandomNumber(10, 99);
  const randomNumber2 = getRandomNumber(10, 99);

  const roomId =
    randomNumber + randomCharacter + randomCharacter2 + randomNumber2;
  return roomId;
}
