import * as express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/env-vars", (req, res) => {
  res.status(202).json({
    port: port,
    enviroment: process.env.NODE_ENV,
    test: true,
  });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});
