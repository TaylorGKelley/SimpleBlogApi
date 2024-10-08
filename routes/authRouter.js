import { Router } from 'express';
import {
  protectRoute,
  signin,
  createAuthor,
  deleteAuthor,
  signout,
  getLoggedInUser,
} from '../controllers/authController.js';

const router = Router();

router.route('/signin').post(signin);
router.route('/signout').post(signout);
router.route('/isLoggedIn').get(protectRoute, getLoggedInUser);
router.route('/createAuthor').post(protectRoute, createAuthor);
// router.route('/author/:id').delete(protectRoute, deleteAuthor);
// router.route for update author?

export default router;
