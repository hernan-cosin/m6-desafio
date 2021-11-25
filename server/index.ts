import * as express from "express";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
import { nanoid } from "nanoid";

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
        res.status(400).json({
          message: "User already exist.",
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;

  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("/rooms/" + nanoid());

        roomRef
          .set({
            // messages: [""],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const randomCharacter =
              alphabet[Math.floor(Math.random() * alphabet.length)];
            const randomCharacter2 =
              alphabet[Math.floor(Math.random() * alphabet.length)];
            const randomNumber = Math.floor(Math.random() * 99);
            const randomNumber2 = Math.floor(Math.random() * 99);
            const roomId =
              randomNumber + randomCharacter + randomCharacter2 + randomNumber2;
            // const roomId = 1000 + Math.floor(Math.random() * 999);
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

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});
