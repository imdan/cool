const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const projectRouter = require('./controllers/projects');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info(`\nconnecting to mongodb...\n`.yellow);

const mongoUrl = config.MONGODB_URI;

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info(`connected to mongoDB\n`.white);
  })
  .catch(err => {
    logger.error('error connecting to mongodb'.red, err.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.get('/', (req, res, next) => {
  res.send('<h1>sup.</h1>');
});

app.use('/api/projects', projectRouter);
// have another route here for email with router using node mailer maybe
// app.use('/contact', emailRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
