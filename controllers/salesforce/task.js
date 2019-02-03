const salesforce = require('../salesforce');

var allowedFields = {
  Id: 1,
  // AccountId: 1,
  OwnerId: 1,
  Description: 1,
  // due date
  ActivityDate: 1,
  Priority: 1,
  // related to
  WhatId: 1,
  ReminderDateTime: 1,
  IsReminderSet: 1,
  Status: 1,
  Subject: 1,
  Type: 1
};

/**
 * @api {post} /tasks Create task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiSuccess {Object} task Task's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task not found.
 */
exports.create = (req, res, next) => {

  var task = {};
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      task[property] = req.body[property];
    }
  }

  salesforce.conn.sobject('Task')
  .create(
    task,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          task[property] = req.body[property];
        }
      }
      task.Id = ret.id;
      task.success = ret.success;
      res.send(task);
    }
  );

};

/**
 * @api {post} /aff Update task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiSuccess {Object} task Task's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task not found.
 */
exports.update = (req, res, next) => {

  var task = {
    Id: req.params.taskid
  };
  for (var property in req.body) {
    if (allowedFields.hasOwnProperty(property)) {
      task[property] = req.body[property];
    }
  }

  // this is where you'll need to add in the relevant req.body if they exist
  salesforce.conn.sobject('Task')
  .update(
    task,
    function (err, ret) {
      if (err || !ret.success) {
        console.error(err);
        return next(err);
      }
      for (var property in req.body) {
        if (!allowedFields.hasOwnProperty(property)) {
          task[property] = req.body[property];
        }
      }
      task.success = ret.success;

      res.send(task);
    }
  );

};
