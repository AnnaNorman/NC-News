const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET/api/topics", () => {
  test("Should return an array of topic objects with each object having the properties slug and descriptiion", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((item) => {
          expect(item).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});
test("GET - 404: Path not found", () => {
  return request(app)
    .get("/api/topic")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("Path not found!");
    });
});

test("GET: 200 - Should return an array of articles sorted by date in descending order", () => {
  return request(app)
    .get("/api/articles")

    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toBeInstanceOf(Array);
      expect(body.articles).toHaveLength(12);
      body.articles.forEach((item) => {
        expect(item).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
      expect(body.articles).toBeSorted({ key: "created_at", descending: true });
    });
});
describe("GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
});
test("status:400, responds with an error message when passed a bad article ID", () => {
  return request(app)
    .get("/api/articles/notAnID")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});
test("status:404, responds with an error message when passed an article that doesn't exist", () => {
  return request(app)
    .get("/api/articles/99")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No resource found");
    });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with an array of comments for the given article_id", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
});
test("status:404, responds with an error message when passed an article that doesn't exist", () => {
  return request(app)
    .get("/api/articles/99/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No resource found");
    });
});
test("status:400, responds with an error message when passed a bad article ID", () => {
  return request(app)
    .get("/api/articles/notAnID/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});
describe("/api/articles/:article_id/comments", () => {
  test("POST - 201: adds the new comment to the DB & responds with an object containing the new comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Here is a body",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.insertedComment).toMatchObject({
          comment_id: 19,
          body: "Here is a body",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
});
test("status:400, responds with an error message when passed a comment without a body or a username", () => {
  return request(app)
    .post("/api/articles/1/comments")
    .send({
      username: undefined,
      body: undefined,
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});
test("status:404, responds with an error message when passed a bad article ID", () => {
  return request(app)
    .post("/api/articles/1/comments")
    .send({
      username: "Anna",
      body: "This is another body",
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No resource found");
    });
});
test("status:404, responds with an error message when passed an article that doesn't exist", () => {
  return request(app)
    .post("/api/articles/99/comments")
    .send({
      username: "butter_bridge",
      body: "This is another body",
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No resource found");
    });
});
test("status:400, responds with an error message when passed a bad article ID", () => {
  return request(app)
    .post("/api/articles/notAnID/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});
