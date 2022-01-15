const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = express();
const fs = require('fs');
const appError = require('../starter/utils/appError');
const errorHandler = require('../starter/controllers/errController');
const morgan = require('morgan');
app.use(express.json());
if ((process.env.Node_ENV = 'development')) {
  app.use(morgan('dev'));
}
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// below, if the route is not defined
app.all('*', (req, res, next) => {
  next(new appError(`can't find ${req.originalUrl}on this server`, 404));
});
app.use(errorHandler);
//end
module.exports = app;
