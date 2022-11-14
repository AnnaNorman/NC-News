
We have two databases - a development database and a test database. Because we have different databases to connect to depending on the environment, we will need two .env files in order to successfully connect to the two databases locally.

In .env.test

PGDATABASE=nc_news_test

In .env.development


PGDATABASE=nc_news
