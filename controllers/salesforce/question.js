const salesforce = require('../salesforce');

/**
 * @api {get} /salesforce/question Retrieve questions
 * @apiName RetrieveQuestions
 * @apiGroup Question
 * @apiUse listParams
 * @apiSuccess {Object[]} questions List of questions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
exports.list = (req, res, next) => {

  salesforce.conn.sobject('Self_assessment_question__c')
  .find(
    {
      'Action__c' : req.params.actionid
    },
    {
      Id: 1,
      Name: 1,
      Question_text__c: 1,
      Self_assessment_topic_alias__c: 1,
      Help_text__c: 1,
      CreatedDate: 1
    }
  )
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(50)
  .skip(0)
  .execute(function(err, records) {
    if (err) {
      console.error(err);
      return next(err);
    }
    console.log("fetched : " + records.length);
    res.send(records);
  });

};
