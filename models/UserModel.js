const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    maxlength: 30,
  },
  lname: {
    type: String,
    required: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 25,
    required: true,
  },
  numberOfRequestCreated: {
    type: Number,
    default: 0,
  },
  numberOfCurrentRequest: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function (next) {
  try {
    //Generate a salt
    const salt = await bcrypt.genSalt(10);

    //Generate hashed password with salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    //Reassign plain text password to hashed password
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (err) {
    throw new Error(error);
  }
};

userSchema
  .virtual('fullname')
  .get(function () {
    return `${this.fname} ${this.lname}`;
  })
  .set(function (name) {
    let split = name.split(' ');
    this.fname = split[0];
    this.lname = split[1];
  });

const User = mongoose.model('user', userSchema);

module.exports = User;
