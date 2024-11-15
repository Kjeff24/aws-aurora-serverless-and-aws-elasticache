<h1>Build a real-time leaderboard with Amazon Aurora Serverless and Amazon ElastiCache</h1>

## DESCRIPTION
Get further understanding of workshop [here](https://aws.amazon.com/tutorials/real-time-leaderboard-amazon-aurora-serverless-elasticache/)  
The tutorial includes:  
- Amazon Aurora Serverless for data storage, including the Data API for HTTP-based database access from your Lambda function.
- AWS Secrets Manager for storing your database credentials when using the Data API.
- Amazon ElastiCache for data storage of global leaderboards, using the Redis engine and Sorted Sets to store your leaderboards.
- Amazon Cognito for user registration and authentication.
- AWS Lambda for compute.
- Amazon API Gateway for HTTP-based access to your Lambda function.

## SETUP
- If AWS Cloud9 is unavailable, you can use an EC2 instance as an alternative for completing the [tutorial](https://aws.amazon.com/tutorials/real-time-leaderboard-amazon-aurora-serverless-elasticache/)
- For Amazon Aurora Serverless, it is recommended to use `8.0.mysql_aurora.3.07.1` as engine in order to enable `Data API`
- Amazon ElastiCache operates within a VPC, so it is advisable to use internal terminals/consoles or resources within the VPC for testing, rather than external terminals/consoles.

## EC2 INSTANCE(UBUNTU) SETUP
- Install AWS CLI
```
wget https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip
unzip awscli-exe-linux-x86_64.zip
sudo ./aws/install --update
```
- Install zip and unzip
```
sudo apt update
sudo apt install zip unzip
```

### TEST DATABASE
```
node scripts/testDatabase.js
```

### CREATE DATABASE
```
node scripts/createTable.js
```

### LOAD SAMPLE DATA TO DATABASE
```
node scripts/insertGames.js
```

### FETCH DATA FOR USER
```
node scripts/fetchHighScoresForUser.js
```

### FETCH DATA FOR USER2
```
excecuteReadSql to reduce boilerplate around calling the Data API
node scripts/fetchHighScoresForUser2.js
```

### EXPORT SECURITY GROUP
```
echo "export SECURITY_GROUP_ID=<security_group_id>" >> env.sh && source env.sh
```

### EXPORT ELASTICACHE PRIMARY ENDPOINT
```
echo "export REDIS_ENDPOINT=<primary_endpoint>" >> env.sh && source env.sh
```

### TEST REDIS
Ensure you are testing within a VPC
```
node scripts/testRedis.js
```

### LOAD DATA TO REGIS (all time, last month, and given day highest scores) 
```
node scripts/loadRedis.js
```

### FETCH TOP FIVE SCORES FROM THE OVERALL LEADERBOARD
```
node scripts/getTopOverallScores.js
```

### CREATE USER POOL
```
bash scripts/create-user-pool.sh
```

### CREATE USER POOL CLIENT
```
bash scripts/create-user-pool-client.sh
```
### CREATE NETWORKING
```
bash scripts/create-networking.sh
```

### CREATE LAMBDA FUNCTION
```
bash scripts/create-lambda.sh
```

### CREATE API ENDPOINT
```
bash scripts/create-rest-api.sh
```

## TEST

### CREATE A USER
curl -X POST ${BASE_URL}/users \
  -H 'Content-Type: application/json' \
  -d '{
	"username": "<username>",
	"password": "<password>",
	"email": "<useremail>"
}'

### LOGIN USER
curl -X POST ${BASE_URL}/login \
  -H 'Content-Type: application/json' \
  -d '{
	"username": "<username>",
	"password": "<password>"
}'

export ID_TOKEN=$(curl -s -X POST ${BASE_URL}/login -H 'Content-Type: application/json' -d '{"username": "<username>", "password": "<password>"}' | jq -r .idToken)


### ADD USER SCORE
curl -X POST ${BASE_URL}/users/<username> \
 -H 'Content-Type: application/json' \
  -H "Authorization: ${ID_TOKEN}" \
  -d '{
	"level": 8,
	"score": 10
}' | jq .

### FETCH MY SCORES
curl -X GET ${BASE_URL}/users/<username> | jq .


### FETCH BY DATE
curl -X GET ${BASE_URL}/scores/2019-11-08 | jq .

curl -X GET ${BASE_URL}/scores/2024-11-15 | jq .
