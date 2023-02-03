Northcoders News API

This repository is for a RESTful api built with Javascript in Node.js and uses PostGreSQL as a database. The API is built using the Express.js framework and was developed using Test Driven Development (TDD), using both Jest and Supertest packages to test end-to-end.

The database features the following tables:

users
articles
comments
topics

This API is hosted on Cyclic and uses ElephantSQL to host the database.

INITIAL SET UP

Please ensure you have node v19.1.0 and PSQL v 14.5 installed as the minimum required versions for this repository.

In order to use this repository, please follow the steps below:

Clone this repository to your own machine.

Create a .env file called .env.development with the following code:

PGDATABASE=nc_news
Create a .env file called .env.test with the following code:
PGDATABASE=nc_news_test
INITIALISE
Once you have followed the steps above, you will need to ensure you have PostGreSQL installed on your machine and that it is running. If you do not have PostGReSQL installed, please visit the official PostGreSQL download page to find the correct package for your machine, and follow the instructions.

Once PostGres is installed and running, please run the following scripts in your terminal to set up the database and seed with data :

npm run setup-dbs
npm run seed
TESTING
In order to test all endpoints, simply run:

npm test
