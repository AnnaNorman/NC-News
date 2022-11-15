const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(404).send({ msg: "No resource found" });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});
module.exports = app;
