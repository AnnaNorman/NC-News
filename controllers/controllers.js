const { selectTopics } = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
};
