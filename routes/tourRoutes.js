const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
router
  .route('/top-5-cheap')
  .get(tourController.alias, tourController.getAllTour);
router
  .route('/')
  .get(authController.protect, tourController.getAllTour) // we add auhcontroller so only loggginjg users can use this route !
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
