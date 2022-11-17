const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.body, comments.article_id, comments.votes, comments.author, comments.created_at FROM comments 
        WHERE article_id = $1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No resource found",
        });
      }
      return res.rows;
    });
};
exports.insertComment = (article_id, content) => {
  const { username, body } = content;
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  } else {
    return db
      .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "No resource found",
          });
        } else {
          return db
            .query(
              `INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3) 
    RETURNING *;`,
              [username, body, article_id]
            )
            .then((result) => {
              return result.rows[0];
            });
        }
      });
  }
};
