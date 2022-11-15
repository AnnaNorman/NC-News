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
