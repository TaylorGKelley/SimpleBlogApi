import { model, Schema } from 'mongoose';

const postSchema = new Schema({
  title: { type: String, required: true },
  tags: [String],
  createdDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date },
  body: [
    {
      attribute: { type: String, enum: ['h1', 'h2', 'h3', 'p', 'code', 'img'] },
      data: { type: String },
    },
  ],
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
});

postSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.populate({ path: 'author', select: ['firstName', 'lastName', 'photo'] });

  next();
});

const PostModel = model('Post', postSchema);

export default PostModel;
