

## Task description
### Context:
A flower shop used to base the price of their flowers on an item by item cost. So if a
customer ordered 10 roses then they would be charged 10x the cost of single rose. The
flower shop has decided to start selling their flowers in bundles and charging the customer
on a per bundle basis. So if the shop sold roses in bundles of 5 and 10 and a customer
ordered 15 they would get a bundle of 10 and a bundle of 5.

The flower shop currently sells the following products:  
**Name**    | **Code** | **Bundles**  
------------|----------|-----------------------------  
Roses       | R12      | 5 @ $6.99, 10 @ $12.99  
Lilies      | L09      | 3 @ $9.95, 6 @ $16.95, 9 @ $24.95  
Tulips      | T58      | 3 @ $5.95, 5 @ $9.95, 9 @ $16.99

### Task:
Given a customer order you are required to determine the cost and bundle breakdown for
each product. To save on shipping space each order should contain the minimal number
of bundles.

### Input:
Each order has a series of lines with each line containing the number of items followed by
the product code
An example input:
```
10 R12
15 L09
13 T58
```

### Output:  
A successfully passing test(s) that demonstrates the following output: (The format of the
output is not important)  
```
10 R12 $12.99  
    1 x 10 $12.99  

15 L09 $41.90  
    1 x 9 $24.95  
    1 x 6 $16.95

13 T58 $25.85  
    2 x 5 $9.95
    1 x 3 $5.95
```

## Installation, configuration, and running the application
My application is a REST API that takes in order requests at `http://localhost:9000/api/v1/orders`. Simply send an order payload (more information below) and it returns your order output.
### Prerequisites
- Node.js
- PostgreSQL
- Postman (or some API platform alternative)

### Setup
1. Clone the repository:
```
git clone https://github.com/AJLandry1000000000/flower-shop.git
cd flower-shop
```

2. Install the node packages:
```
npm install
```

3. Configure your environment variables:
In the `.env` file in the root directory and add your database details. 
In a production system these variables would be stored secretly in a service such as AWS Secrets Manager. 
But for our non-confidential and simple application, I have provided you with an `.env` file. 
Adjust this file according to your system (alternatively, keep it as is, and I guide you through the rest):
```
PORT=9000
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="flower_shop_db"
DB_USER="myuser"
DB_USER_PASSWORD="mypassword"
```

4. Start the PostgreSQL service:
```
sudo service postgresql start
```

5. Create our PostgreSQL user (skip this part if you are using an existing user), create the database, and grant our user permissions:
```
sudo -u postgres psql
CREATE USER myuser WITH PASSWORD 'mypassword';
ALTER USER myuser CREATEDB;
CREATE DATABASE flower_shop_db;
GRANT ALL PRIVILEGES ON DATABASE flower_shop_db TO myuser;
\c flower_shop_db
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myuser;
```

6. Lastly, run the Knex migrations and seed the database:
```
npm run setup
```

You are now ready to start the application!

### Running the application
To start the application, use the following command:
```
npm start
```

### Running tests
To run the tests, use the following command:
```
npm test
```

### API Usage
To create an order send a POST request to `http://localhost:9000/api/v1/orders` with a JSON payload similar to the following:
```
[
    { "quantity": 6, "code": "L09" },
    { "quantity": 3, "code": "T58" },
    { "quantity": 5, "code": "R12" },
    { "quantity": 10, "code": "R12" }
]
```





## Design decisions
### Class breakdown 
- `Model`: This class is the base class for database operations. Technically our application doesn't need this, but in assuming our application grew over time, more database tables would be made, and hence would need to inherit the basic operations from this `Model` class.
- `ProductModel`: This class handles database operations for products. It inherits from the `Model` class.
- `RequestHandler`: This class processes incoming requests, validates the payload, and formats our results data to send back to the requester.
- `OrderCalculator`: Calculates the optimal bundle breakdown for orders.

### Algorithm explanation
What is my algorithms time complexity and space complexity?
### Algorithm explanation
The algorithm uses Dynamic Programming (DP) to find the minimal number of bundles for each order.  
This solution uses an array where each index, i, of the array represents the minimal bundles for the product to fill an order for i flowers. It slowly builds up to the quantity requested in the order by considering how a new bundle could be added to an existing set of bundles. See `dynamicBundleCalculator()` in `OrderCalculator.js` for the complete logic.  
  
This algorithms time complexity is O(n*m) where n is the number of products and m is the quantity ordered. The space complexity is O(m).  

**Solution context**:  
Originally I wrote my algorithm as a recursive backtracking solution (See `recursiveBundleCalculator()` in `OrderCalculator.js` for the complete logic). This solution would find every bundle combination, starting with the combinations with largest bundle quantity solutions (and therefore the minimum bundle size), and return the first valid bundle combination it found.  
For each failed recursion (i.e. an invalid bundle combination), it would backtrack to the previous recursion and try either reducing the amound of the current bundle quantity (i.e. 6 sets of quantity 9 instead of 7 sets of quantity 9), or reducing the bundle quantity (i.e. try bundle quantity 3 instead quantity 9).  
This solution did work, and would always find a valid solution if there was one. However it had the following properties which made it sub-optimal for a production environment:
- The algorithm's time complexity grew exponentially with the order quantity and the number of bundle variations.
- Since the algorithm finds every combination, it could spend time recalculating potential solutions with the same bundles. e.g. if we have bundles of 7 and 6, and an order for 17, there is no combination that would satisfy this order. But my backtracking solution would test the combinations of (7, 6), then it would calculation the combinations of (6, 7) <- this is sub-optimal!  

So, while my backtracking recursive solution did work, I tried to find a way to reduce the time complexity and use memoization (caching) to reduce recalculation of the same combinations.  
Memoization is one of the two main ways of developing DP algorithms (the other being tabulation), additionally previous bundle solutions could be built upon for a larger solution. So a DP algorithm fit the description of what I was looking for. I built my final solution (and ended up using a tabulation method instead of memoization because it was simpler to read that memoization, which would have required recursion) using dynamic programming. 


### Assumptions 
- An exact solution is required. Overcharging by giving more flowers is not allowed.

## Further improvements
- Add more comprehensive error handling.
- Optimize the dynamic programming algorithm further. e.g. when the bundles remain the same, so too will the DP array for every index. So we could improve request time by saving the DP array information in a table, and recalculating it up to some large number, N, whenever a new bundle was added for a flower. We could then just look up the bundle configuration for a request, instead of recalculating it every time. 
- Implement caching for frequently requested products.
- In a real production enviroment we would save our enviroment variables in some cloud service instead of a .env file.
- Breaking our data into two tables might be a good idea. This isn't required, but would make data analytics and data safety (i.e. ensuring there are certain (quantity, price) pairs) easier. Those two tables could be:
    - One for products, 'product_table' containing ('name', 'code')
    - One for bundles, 'bundle_table' containing ('code', 'quantity', 'price')  
- Add functionality to save a given order request. As our application grows we will likely need to record order requests for caching, analytics, and other functionality.
- Add more tests to the testing suite.

## Tests
My tests cover the following scenarios:
- Order creation: Successfully filling the assignments example order
- Order creation: Successfully filling orders requiring only one type of bundle.
- Order creation: Successfully filling orders requiring several types of bundles.
- Order creation: Unsuccessfully filling an order because no bundle combinations exist.
- Payload validation: Testing error handling for invalid flower codes.
- Payload validation: Testing error handling for invalid order quantities.
- Payload validation: Testing error handling for empty order payloads.
- Payload validation: Testing error handling for an empty order list in the payload.
- Payload validation: Testing error handling for an invalid type in the order payload.  
- OrderCalculator unit test: Testing the correct bundle calculation for a simple valid order.
- OrderCalculator unit test: Testing the correct bundle calculation for a more complex valid order.
- OrderCalculator unit test: Testing the correct handling of an unfillable order because no bundle combinations exist.

They ensure that the application behaves as expected under different conditions.
Run the tests using the following command:  
```
npm test
```













