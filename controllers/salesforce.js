const jsforce = require('jsforce');

const conn = new jsforce.Connection(
  // {
  //   loginUrl: 'https://test.salesforce.com'
  // }
);
const pat = process.env.SALESFORCE_PASSWORD
              + process.env.SALESFORCE_ACCESS_TOKEN;

conn.login(process.env.SALESFORCE_USERNAME, pat, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log("User ID: " + userInfo.id);
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
});

exports.conn = conn;

// an example of OR in conditions object
// conn.sobject("Account")
//     .find({
//         $or: [
//            { Name : { $like: "ACME%" } },
//            { Name : { $like: "Mashmatrix%" } }
//         ]
//     })
//     .execute(function (err, accounts) {
//         // ...
//     })

// for more examples review MongoDB stuff
// https://docs.mongodb.com/manual/tutorial/query-documents/
// https://docs.mongodb.com/manual/reference/operator/query/
