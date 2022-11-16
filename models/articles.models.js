const { query } = require("../db/connection");
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
