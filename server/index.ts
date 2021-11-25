import * as express from "express";
import { firestore } from "./db";
import * as cors from "cors";

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

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});
