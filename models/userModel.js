const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'im not sure if this is a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'provide a password'],
    minlength: 6,
    select: false, // in the api or post this field will not be showen security reasons !
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password again'],
    validate: {
      //this only works on save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});
//run thsi fucntion before u save the doc
userSchema.pre('save', async function (next) {
  //hash the password
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //do not persist passwordconfirmation into to DB
  this.passwordConfirm = undefined;
  next();
});
//instance method is available for all the colletion for comparing passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const user = mongoose.model('User', userSchema);
module.exports = user;
