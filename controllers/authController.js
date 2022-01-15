const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    // if we use await user.create(req.body) anyone can signup with role admin exepmle somebody specifies something like this role:admin, so follow the method below
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'succes',
    token,
    data: {
      user: newUser,
    },
  });
  next();
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body; // this is called object destructing we can't have the same variable name so use this method
  console.log(`here is your email and your passowrds ${email}`);
  // 1, check if email and password exists
  if (!email || !password) {
    return next(new AppError('please provide email and password', '400')); //always use return if you have res after to prevent the error cannot send headers after they sent to the client
  }
  // 2 check if user exists and password is coorect matched
  const user = await User.findOne({ email }).select('+password'); // in es6 rather tha findone({email:email});we used +select because password in the file models is select false;
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', '401'));
  }
  //3 if everyhting is okey ,send token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'scucess',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1 hceck if the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; //we have (bearer token) we use split by space then 1 to take the second element of the array whihc is the token
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('you are not logged, please login to get access', '401')
    );
  }
  // 2 verify  token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //handle error in error controller

  //3 user who wants to acces the route  still exists
  //4 heck if user chage password  after the token was issues
  next();
});
