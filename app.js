/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const path = require('path');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const multer = require('multer');
const jsforceAjaxProxy = require('jsforce-ajax-proxy');
const cors = require('cors');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const accountController = require('./controllers/salesforce/account')
const actionController = require('./controllers/salesforce/action');
const affiliationController = require('./controllers/salesforce/affiliation');
const contactController = require('./controllers/salesforce/contact');
const participantController = require('./controllers/salesforce/participant');
const questionController = require('./controllers/salesforce/question');
const responseController = require('./controllers/salesforce/response');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// JSforce proxy
app.all('/proxy/?*', jsforceAjaxProxy());

// CORS
var corsWhitelist = [
  process.env.DEV_URI,
  process.env.PRODUCTION_URI
];
var corsOptions = {
  origin: function (origin, callback) {
    if (corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

/**
 * Primary app routes.
 */
// DISABLED
// app.get('/salesforce/action', cors(corsOptions), actionController.list);
// ENABLED
app.get('/salesforce/account', cors(corsOptions), accountController.list);
app.get('/salesforce/account/:accountid', cors(corsOptions), accountController.retrieve);
app.get('/salesforce/action/:slug', cors(corsOptions), actionController.retrieve);
app.get('/salesforce/affiliation/:contactid/:accountid', cors(corsOptions), affiliationController.retrieve);
app.get('/salesforce/contact/:email', cors(corsOptions), contactController.retrieve);
app.get('/salesforce/participant/:contactid/:actionid', cors(corsOptions), participantController.retrieve);
app.get('/salesforce/question/:actionid', cors(corsOptions), questionController.list);
app.get('/salesforce/response/:participantid', cors(corsOptions), responseController.list);
app.get('/salesforce/response/:participantid/:questionid', cors(corsOptions), responseController.retrieve);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
