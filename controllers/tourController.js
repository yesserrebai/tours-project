const tourModel = require('../models/tourModel');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/CatchAsync');

exports.alias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,summary';
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};
exports.checkID = (req, res, next, val) => {
  const findId = toursSimple.find((el) => el.id === val * 1);
  if (!findId) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID',
    });
  }
  next();
};

exports.getAllTour = catchAsync(async (req, res) => {
  //excute
  //console.log(req)
  const features = new ApiFeatures(tourModel.find(), req.query)
    .filter()
    .sort()
    .pagination();
  const tours = await features.query;
  //send
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: { tours: tours },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await tourModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.getTour = async (req, res) => {
  const tour = await tourModel.findById(req.params.id);

  if (!tour) {
    return next(new AppError('no tour found with this iD ', 404));
  }
  res.status(200).json({
    status: 'success',
    message: tour,
  });
};

exports.patchTour = catchAsync(async (req, res) => {
  const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findByIdAndDelete(req.params.id);
  if (!tour) {
    next(new AppError('no tour find with this id', 404));
  }
  res.status(204).json({
    status: 'succes',
    message: null,
  });
});
