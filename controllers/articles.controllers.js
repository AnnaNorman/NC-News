const {
  fetchCommentsByArticleId,
  insertComment,
} = require("../models/articles.models");

exports.getCommentsByArticleId = (req, rest, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      rest.status(200).send({ comments });
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  insertComment(article_id, req.body)
    .then((insertedComment) => {
      res.status(201).send({ insertedComment: insertedComment });
    })
    .catch(next);
};
