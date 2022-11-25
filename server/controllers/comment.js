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

export const getUserComments = async(req, res, next) => {
  try {
    const comments = await Comment.find({userId: req.user.id})
    res.status(200).json(comments)
  } catch (err) {
    next(err)
  }
}

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

export const editComment = async(req, res, next) => {
  try {
    const comment = await Comment.findById( req.params.id)
		if (!comment) return next(createError(404, "Comment could not be found"));
    if (comment.userId === req.user.id) {
      const editedComment = await Comment.findByIdAndUpdate(comment._id, {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(editedComment)
    }
  } catch (err) {
    next(err)
  }
};

export const deleteComment = async(req, res, next) => {
  try {
    const comment = await Comment.findById( req.params.id)
		if (!comment) return next(createError(404, "Comment could not be found"));
    const video = await Video.findById(comment.videoId)
    // comment owner and video owner can delete comment
    if(comment.userId === req.user.id || video.userId === req.user.id) {
      // if comment have childs delete them
      if(comment.childs.length) {
        const foundParents = [];
        const removeChilds = async(parent) => {
          await Promise.all(
            parent.childs.map(async(childId)=>{
              const child = await Comment.findById(childId)
              if (child.childs.length > 0) {
                foundParents.push(child)
              } else {
                await Comment.findByIdAndDelete(childId)
                console.log("child deleted");
              }
            }),
            await Comment.findByIdAndDelete(parent._id)
          );
          foundParents.length && removeChilds(foundParents.shift())
        }
        removeChilds(comment)
      } else {
        await Comment.findByIdAndDelete(req.params.id)
      }
      // if this is a reply, reduce parent comment's reply count
      comment.parent && await Comment.findByIdAndUpdate(comment.parent, {
        $pull: {childs: comment._id}
      }, {new:true})
      res.status(200).json("Comment has been deleted successfully!")
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
    const comment = await Comment.findById(commentId);
    if (comment.likes.includes(userId)) {
      const likedCom = await Comment.findByIdAndUpdate(commentId, {
        $pull:{likes: userId},
      }, {new:true})
      res.status(200).json(likedCom)
    } else {
      const likedCom = await Comment.findByIdAndUpdate(commentId, {
        $addToSet:{likes: userId},
        $pull: {dislikes: userId}
      }, {new:true})
      res.status(200).json(likedCom)
    }
  } catch (err) {
    next(err)
  }
};

export const dislikeComment = async(req, res, next) => {
  try {
    const userId = req.user.id
    const {commentId}  = req.params
    const comment = await Comment.findById(commentId);
    if (comment.dislikes.includes(userId)) {
      const dislikedCom = await Comment.findByIdAndUpdate(commentId, {
        $pull:{dislikes: userId},
      }, {new:true})
      res.status(200).json(dislikedCom)
    } else {
      const dislikedCom = await Comment.findByIdAndUpdate(commentId, {
        $addToSet:{dislikes: userId},
        $pull: {likes: userId}
      }, {new:true})
      res.status(200).json(dislikedCom)
    }
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