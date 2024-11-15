const AWS = require('aws-sdk')

const rdsdataservice = new AWS.RDSDataService();

const params = {
  resourceArn: process.env.DATABASE_ARN,
  secretArn: process.env.SECRET_ARN,
  database: 'leaderboard',
  sql: 'SELECT 1'
}

rdsdataservice.executeStatement(params, function(err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
})