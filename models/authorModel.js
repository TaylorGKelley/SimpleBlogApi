import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const authorSchema = new Schema({
  firstName: { type: String, required: [true, 'User must have a First Name'] },
  lastName: { type: String, required: [true, 'User must have a Last Name'] },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: Buffer,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: `The passwords do not match`,
    },
  },
  passwordChangedAt: { type: Date, default: Date.now() },
});

authorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

authorSchema.methods.correctPassword = async function (
  providedPassword,
  authorPassword
) {
  return await bcrypt.compare(providedPassword, authorPassword);
};

authorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const AuthorModel = model('Author', authorSchema);

export default AuthorModel;
