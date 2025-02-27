Backtracking algorithm: Explain why i am using a recursive function. use the example of order for 14 and bundles = [9, 3, 2] (in this example, simply using the largest bundle and subtracting that from the order number, does not lead to a solution)

Explain why I hardcoded the data, and that in reality we would use a database table.

Assumption: There needs to be an exact solution. We cannot over charge them by giving them more flowers. WHAT IF WE WANTED TO ALLOW OVER CHARGING?


Build a recursive solution which starts with the biggest bundles and backtracks when a solution doesn't work, to test the next smallest bundle (one up the recursion chain).

CONSIDER EDGE CASES!

TEST WITH INVALID COMBINATIONS!

Change the package.json file to not use nodemon?



Commands:
sudo service postgresql start

CREATE A USER...
sudo -u postgres psql

CREATE USER myuser WITH PASSWORD 'mypassword';

ALTER USER myuser CREATEDB;

psql -U myuser -h localhost -p 5432 -d postgres

CREATE DATABASE flower_shop_db;

sudo -u postgres psql

GRANT ALL PRIVILEGES ON DATABASE flower_shop_db TO myuser;

\c flower_shop_db
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myuser;


optional... Connect to the newly created database
psql -U myuser -h localhost -p 5432 -d flower_shop_db


