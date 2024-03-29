const { query } = require("../db/connection");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = (
  sort_by = "created_at",
  userOrder = "desc",
  topic
) => {
  const validColumns = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  const validOrder = ["desc", "asc"];
  if (!validOrder.includes(userOrder)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  let queryStr = `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;
  const queryValues = [];
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${userOrder}`;
  return db.query(queryStr, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No resource found",
      });
    }
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No resource found",
        });
      }
      return result.rows[0];
    });
};
