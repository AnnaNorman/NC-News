const express = require("express");
const app = express();
const { getTopics, getArticles } = require("./controllers/controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});
module.exports = app;
