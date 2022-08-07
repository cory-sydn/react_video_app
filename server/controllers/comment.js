import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";


export const getAllComments = async(req, res, next) => {
  try {
    const allComments = await Comment.find({videoId: req.params.videoId})
    res.status(200).json(allComments)
  } catch (err) {
    next(err)
  }
};

export const addComment = async(req, res, next) => {
  try {
    const newComment = new Comment({
      userId: req.user.id,
      ...req.body
    });
    const savedComment = await newComment.save()
    res.status(200).send(savedComment)
  } catch (err) {
    next(err)
  }
};

export const deleteComment = async(req, res, next) => {

  try {
    const comment = await Comment.findById( req.params.id)
    const video = await Video.findById(req.body.videoId)
    // comment owner and video owner can delete comment
    if(comment.userId === req.user.id || video.userId === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id)
      res.status(200).json("The comment has been deleted successfully")
  } else {
      next(createError(403, "You can only delete your own comment!"))
    }
  } catch (err) {
    next(err)
  }
};
