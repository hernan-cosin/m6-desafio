import * as express from "express";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import { nanoid } from "nanoid";
import { state } from "../client/state";
import map from "lodash/map";

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
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existís",
        });
      }
    });
});

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
      res.json({ update: true });
    });
});

app.post("/rooms/choice", (req, res) => {
  const { roomId } = req.body;
  const { choice } = req.body;
  const { player } = req.body;
  roomsCollection
    .doc(roomId.toString())
    .update({
      history: [
        {
          [player]: choice,
        },
      ],
    })
    .then(() => {
      res.json({
        id: roomId.toString(),
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
