import jwt from 'jsonwebtoken';
import Author from '../models/authorModel.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send('You are not signed in');
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentAuthor = await Author.findById(decoded.id);
  if (!currentAuthor) {
    return res
      .status(401)
      .send('The user belonging to this token no longer exists.');
  }

  if (currentAuthor.changedPasswordAfter(decoded.iat)) {
    return res
      .status(401)
      .send('User recently changed password. Please login again.');
  }

  req.user = currentAuthor;
  next();
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      res
        .status(400)
        .send(`Please provide ${!email ? 'an email' : 'a password'}`)
    );
  }

  const user = await Author.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Error('Incorrect email or password'));
  }

  createSendToken(user, 201, res);
};

export const signout = async (req, res) => {
  res.status(200).clearCookie('jwt').json({
    status: 'signed out',
    message: 'User successfully signed out',
  });
};

export const createAuthor = async (req, res) => {
  try {
    const newAuthor = await Author.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    newAuthor.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user: newAuthor,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'user is most likely already create',
      message: error.name,
    });
  }
};

// Configure Authorization for this before enabling
export const deleteAuthor = async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (deletedAuthor) {
      res.status(200).json({
        status: 'success',
        data: null,
      });
    } else {
      throw new Error('Can not find Author with that Id');
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
