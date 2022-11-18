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
describe("GET/api/articles", () => {
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
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("10: GET: 200 - can sort an array of articles by specified topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((item) => {
          expect(item.topic).toBe("mitch");
        });
      });
  });

  test("GET: 200 - an array of articles sorted by date by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET: 200 - can sort array of articles by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("GET: 200 - can sort array of articles by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("GET: 200 - can sort array of articles by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET: 200 - can sort array of articles by body", () => {
    return request(app)
      .get("/api/articles?sort_by=body")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("body", { descending: true });
      });
  });
  test("GET: 200 - can sort array of articles by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET: 200 - can sort array of articles by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("GET: 200 - allow client to change the sort order with an order query", () => {
    return request(app)
      .get("/api/articles?order=asc&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({ key: "votes", ascending: true });
      });
  });

  test("GET: 400 - reject order query when passed invalid term  ", () => {
    return request(app)
      .get("/api/articles?order=dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort query");
      });
  });

  test("GET: 404 - returns no resource found when query value does not exist in column ", () => {
    return request(app)
      .get("/api/articles?topic=dog")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No resource found");
      });
  });
});

test("GET: 400 - returns invalid sort query when sort_by query column does not exist", () => {
  return request(app)
    .get("/api/articles?sort_by=dog")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("invalid sort query");
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
          comment_count: 11,
        });
      });
  });
});
test("status:200, responds with a single matching article and a comment count of 0 when passed a valid article_id with no comments", () => {
  const article_id = 2;
  return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(200)
    .then(({ body }) => {
      expect(body.article).toEqual({
        article_id: 2,
        author: "icellusedkars",
        title: "Sony Vaio; or, The Laptop",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        topic: "mitch",
        created_at: expect.any(String),
        votes: 0,
        comment_count: 0,
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
        expect(res.body.comment).toMatchObject({
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
test("status:404, responds with an error message when passed a bad username", () => {
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
describe("PATCH /api/articles/1", () => {
  it("status:200, responds with the updated article", () => {
    const articleUpdates = {
      inc_votes: "1",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdates)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
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
test("status:400, responds with an error message when passed a vote that isn't a number", () => {
  const articleUpdates = {
    inc_votes: "a",
  };
  return request(app)
    .patch("/api/articles/1")
    .send(articleUpdates)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});
test("status:400, responds with an error message when inc vote is missing", () => {
  const articleUpdates = {};
  return request(app)
    .patch("/api/articles/1")
    .send(articleUpdates)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});
describe("GET/api/users", () => {
  test("Should return an array of user objects with each object having the properties user_name, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((item) => {
          expect(item).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
test("GET - 404: Path not found", () => {
  return request(app)
    .get("/api/user")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("Path not found!");
    });
});
