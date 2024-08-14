import { Router } from 'express';
import { protectRoute } from '../controllers/authController.js';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from '../controllers/postController.js';

const router = Router();

router.route('/').get(getAllPosts).post(protectRoute, createPost);

router
  .route('/:id')
  .get(getPost)
  .patch(protectRoute, updatePost)
  .delete(protectRoute, deletePost);

export default router;
