const {
  fetchCommentsByArticleId,
  insertComment,
  updateArticleById,
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
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};
exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  updateArticleById(req.body, article_id)
    .then((result) => res.status(200).send({ article: result }))
    .catch(next);
};
