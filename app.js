const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers");
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
