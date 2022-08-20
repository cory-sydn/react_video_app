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

export const getAllReplies = async(req, res, next) => {
  try {
    const allReplies = await Comment.find({parent: req.params.parentId}).limit(10)
    res.status(200).json(allReplies)
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


export const likeComment = async(req, res, next) => {
  try {
    const userId = req.user.id
    const {commentId}  = req.params
    const likedCom = await Comment.findByIdAndUpdate(commentId, {
      $addToSet:{likes: userId},
      $pull: {dislikes: userId}
    }, {new:true})
    res.status(200).json(likedCom)
  } catch (err) {
    next(err)
  }
};

export const dislikeComment = async(req, res, next) => {
  try {
    const userId = req.user.id
    const {commentId}  = req.params
    const dislikedCom = await Comment.findByIdAndUpdate(commentId, {
      $addToSet:{dislikes: userId},
      $pull: {likes: userId}
    }, {new:true})
    res.status(200).json(dislikedCom)
  } catch (err) {
    next(err)
  }
};

export const reply = async(req, res, next) => {
  try {
    const {commentId}  = req.params
    const {childId} = req.body
    const parentComment = await Comment.findByIdAndUpdate(commentId, {
      $addToSet:{childs: childId},
    }, {new:true})
    res.status(200).json(parentComment)
  } catch (err) {
    next(err)
  }
};