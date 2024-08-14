import Post from '../models/postModel.js';
import APIFeatures from '../utils/APIFeatures.js';

export const getAllPosts = async (req, res) => {
  try {
    // build query
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // execute query
    const posts = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      res.status(200).json({
        status: 'success',
        data: {
          post,
        },
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: `Couldn't find a post with that Id`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { _id: newPostId } = await Post.create({
      ...req.body,
      author: req.user._id,
    });
    const newPost = await Post.findById(newPostId);

    res.status(200).json({
      status: 'success',
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedDate: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
