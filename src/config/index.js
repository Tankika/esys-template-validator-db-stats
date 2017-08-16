'use strict';

const path = require('path');

module.exports = {
  root: path.normalize(__dirname + '/../processes/web'),
  env: process.env.NODE_ENV,
  ip: process.env.IP || undefined,
  port: process.env.PORT || 8084,
  token: {
    secret: process.env.TOKEN_SECRET,
    expiration: parseInt(process.env.TOKEN_EXPIRATION)
  },
  escher: {
    keyPool: process.env.KEY_POOL,
    credentialScope: process.env.SUITE_ESCHER_CREDENTIAL_SCOPE
  },
  sessionValidator: {
    serviceUrl: process.env.SESSION_VALIDATOR_SERVICE_URL || undefined,
    apiKey: process.env.SESSION_VALIDATOR_SERVICE_API_KEY || undefined,
    apiSecret: process.env.SESSION_VALIDATOR_SERVICE_API_SECRET || undefined,
    enableCache: true
  },
  disableSessionValidation: process.env.DISABLE_SESSION_VALIDATION === 'true',
  disableCompressResponse: process.env.DISABLE_COMPRESS_RESPONSE === 'true',
  incentives: {
    keyId: process.env.INCENTIVES_ESCHER_KEY_ID,
    credentialScope: process.env.INCENTIVES_ESCHER_CREDENTIAL_SCOPE || 'eu/incentives/ems_request',
    secure: process.env.INCENTIVES_SECURE !== 'false',
    rejectUnauthorized: process.env.INCENTIVES_REJECT_UNAUTHORIZED !== 'false',
    host: process.env.INCENTIVES_HOST || 'incentives.eservice.emarsys.net',
    port: Number(process.env.INCENTIVES_PORT || 443),
    timeout: parseInt(process.env.INCENTIVES_REQUEST_TIMEOUT)
  },
  notificationCenter: {
    url: process.env.NOTIFICATION_CENTER_URL || 'http://localhost:9000',
    apiToken: process.env.NOTIFICATION_CENTER_API_TOKEN || 'API TOKEN'
  },
  mongooseUri: process.env.MONGODB_URL ||
               process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
               'mongodb://localhost/contentblocks',
  doctypes: {
    // eslint-disable-next-line max-len
    XHTML1Transitional: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    html5: '<!DOCTYPE html>'
  },
  defaultDoctype: process.env.DEFAULT_DOCTYPE,
  urlChecker: {
    requestTimeout: parseInt(process.env.URL_CHECKER_REQUEST_TIMEOUT)
  },
  localStorageVersion: process.env.LOCAL_STORAGE_VERSION || 'v1',
  logmatic: {
    enabled: process.env.LOGMATIC_API_KEY !== undefined,
    logSource: process.env.LOGMATIC_LOG_SOURCE || 'ems-content-blocks-staging',
    apiKey: process.env.LOGMATIC_API_KEY
  },
  database: {
    writeTimeout: process.env.DATABASE_WRITE_TIMEOUT || 5000
  },
  gracefulShutdown: {
    timeout: parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT) || 20000
  }
};
