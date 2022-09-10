import express from "express";
import { addComment, deleteComment, dislikeComment, editComment, getAllComments,
  getAllReplies, getUserComments, likeComment, reply } 
  from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router()

// params: videoId
router.get("/:videoId", getAllComments)
router.get("/replies/:parentId", getAllReplies)
router.get("/user/:userId", verifyToken, getUserComments)

router.post("/", verifyToken, addComment)

router.delete("/:id", verifyToken, deleteComment)

router.put("/:id", verifyToken, editComment)
router.put("/like/:commentId", verifyToken, likeComment)
router.put("/dislike/:commentId", verifyToken, dislikeComment)
router.put("/reply/:commentId", verifyToken, reply)


export default router;