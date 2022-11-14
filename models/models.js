const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("hello");
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};
