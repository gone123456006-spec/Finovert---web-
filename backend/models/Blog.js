import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  sourceLink: {
    type: String,
    default: '',
  },
  sourceName: {
    type: String,
    default: '',
  }
}, {
  timestamps: true // This will automatically create createdAt and updatedAt fields
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
