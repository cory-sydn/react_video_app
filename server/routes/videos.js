import express from "express";
import {
	addVideo,
	addView,
	deleteVideo,
	dislike,
	getByTag,
	getLikedVideos,
	getVideo,
	like,
	randomVideos,
	search,
	subsVideos,
	trendVideos,
	updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// CREATE/
router.post("/", verifyToken, addVideo);

// READ/ GET VIDEO
router.get("/find/:id", getVideo);
// TREND
router.get("/trend", trendVideos);
// RANDOM
router.get("/random", randomVideos);
// SUBSCRIBED CHANNEL VIDEOS
router.get("/sub", verifyToken, subsVideos);
// GET BY THE TAGS
router.get("/tags", getByTag);
// QUERY
router.get("/search", search);
// Videos that user liked
router.get("/liked", verifyToken, getLikedVideos)

// UPDATE/
router.put("/:id", verifyToken, updateVideo);
// INCREASE VIEW COUNT
router.put("/view/:id", addView);
router.put("/like/:videoId", verifyToken, like);
router.put("/dislike/:videoId", verifyToken, dislike);

// DELETE VIDEO
router.delete("/:id", verifyToken, deleteVideo);


export default router;
