// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/socialmedia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Post = mongoose.model('Post', new mongoose.Schema({
  username: String,
  content: String,
  tag: String,
  mediaUrl: String,
  likes: { type: Number, default: 0 },
  comments: [String]
}));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// API endpoints
app.post('/posts', upload.single('media'), async (req, res) => {
  const { username, content, tag } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newPost = new Post({ username, content, tag, mediaUrl });
  await newPost.save();
  res.status(201).json(newPost);
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ _id: -1 });
  res.json(posts);
});

app.post('/posts/:id/like', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes++;
  await post.save();
  res.json(post);
});

app.post('/posts/:id/comment', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push(req.body.comment);
  await post.save();
  res.json(post);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
