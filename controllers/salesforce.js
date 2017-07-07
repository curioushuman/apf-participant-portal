const jsforce = require('jsforce');

const conn = new jsforce.Connection();
const pat = process.env.SALESFORCE_PASSWORD
              + process.env.SALESFORCE_ACCESS_TOKEN;
var peach = 'peach';
conn.login(process.env.SALESFORCE_USERNAME, pat, function(err, userInfo) {
  if (err) { return console.error(err); }
  peach = userInfo.id;
  console.log("User ID: " + peach);
});

exports.conn = conn;
