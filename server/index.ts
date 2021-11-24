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

app.listen(port, () => {
  console.log(`App running in port ${port}`);
});
