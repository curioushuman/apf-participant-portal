const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  FirstName: 1,
  LastName: 1,
  Email: 1
};

/**
 * @api {get} /salesforce/user/:uid Retrieve user
 */
exports.retrieve = (req, res, next) => {

  salesforce.conn.sobject('User')
  .find(
    {
      'Id' : req.params.uid
    },
    allowedFields
  )
  .limit(1)
  .execute(function(err, records) {
    if (err) {
      console.error(err);
      return next(err);
    }
    console.log("fetched : " + records.length);
    if (records.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(records[0]);
    }
  });

};
