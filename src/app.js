
import "babel-polyfill";
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';

import mongooseConnexion from './utils/mongooseConnexion';
import { jwtSecret, serverConfig, morganLogMode } from './utils/config';
import { checkAndTransformAuthError } from './utils/errors';

// Routers

import auth from './routers/auth';
import users from './routers/users';

const app = express();

// Middlewares

app.use(jwt({ secret: jwtSecret }).unless({ path: ['/auth/token'] }));
app.use(cors());
// disable logger in mocha env
if (typeof global.it !== 'function') app.use(morgan(morganLogMode));
app.use(bodyParser.json());

// Routes

app.use('/auth', auth);
app.use('/users', users);

// 404 and error handling

app.use((req, res, next) => {
  const err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err = checkAndTransformAuthError(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || "00000",
      status,
      message: err.message
    }
  });
  // checks if we're not in mocha env
  if (typeof global.it !== 'function') console.log(err);
});

const cleanup = () => {
  mongooseConnexion.close();
  console.log('Closed DB Connexion.');
};

// Start the server
const { host, port } = serverConfig;
app.listen(port, host, () => {
  console.log(`Server is listening on : ${host}:${port}`);
  process.on('SIGINT', () => { process.exit(0) });
  process.on('SIGTERM', () => { process.exit(0) });
  process.on('exit', cleanup);
});

module.exports = app;