const { fetchCommentsByArticleId } = require("../models/articles.models");

exports.getCommentsByArticleId = (req, rest, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      rest.status(200).send({ comments });
    })
    .catch(next);
};
