const AppError = require('../utils/appError');

const HandleCastErrorDB = (err) => {
  const msg = `invalid ${err.path}: ${err.value}`;
  return new AppError(msg, '400');
};
const HandleDuplicateFieldsDB = (err) => {
  const msg = `duplicate value :${err.keyValue.name}`;
  //console.log(msg)
  return new AppError(msg, '400');
};
const HandleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = 'Invalid input Data ' + error.join('. ');
  return new AppError(message, '400');
};
const handleJWTError = (err) => {
  return new AppError('invalid token please loging again', '401');
};

const sendErrorDev = (err, res) => {
  console.log('send error dev', err.statusCode);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const SendErrorProd = (err, res) => {
  //operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  /// programatic or other error
  else {
    console.error('Error'); //kenet Error,err
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    console.log('eroor occured in dev mode ');
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    sendErrorDev(err, res);
    next();
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = HandleCastErrorDB(error);
    if (error.code === 11000) error = HandleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = HandleValidationErrorDB(error);
    if (error === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    SendErrorProd(error, res);
    next();
  }
};
