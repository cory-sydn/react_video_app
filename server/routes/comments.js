import express from "express";
import { addComment, deleteComment, getAllComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router()

// params: videoId
router.get("/:videoId", getAllComments)

router.post("/", verifyToken, addComment)

router.delete("/:id", verifyToken, deleteComment)


export default router;