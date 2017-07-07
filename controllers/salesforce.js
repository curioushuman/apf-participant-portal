const jsforce = require('jsforce');

const conn = new jsforce.Connection();
const pat = process.env.SALESFORCE_PASSWORD
              + process.env.SALESFORCE_ACCESS_TOKEN;

conn.login(process.env.SALESFORCE_USERNAME, pat, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log("User ID: " + userInfo.id);
});

exports.conn = conn;
