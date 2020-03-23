var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  publishDate: {
    type: Date,
    required: true,
    trim: true
  },
  publisherId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    trim: true
  }
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;
