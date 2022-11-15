const { query } = require("../db/connection");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = (sort_by = "created_at") => {
  queryStr = `SELECT articles.*, COUNT(articles.article_id)::INT AS comment_count FROM articles
  JOIN users ON articles.author = users.username

  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  return db.query(queryStr).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No resource found",
      });
    }
    return result.rows;
  });
};
