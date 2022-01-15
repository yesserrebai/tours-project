const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have a name'],
      unique: [true, 'name of tour must be unique'],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: Number,
    duration: {
      type: Number,
      required: [true, 'tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'tour must have diffuclty'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'tour must have summuray'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'tour must have image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
/* tourSchema.post('/^find/', function (docs, next) {
  console.log("middleware for find query --");
  next();
}); */
/* tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
}); */
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
