import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
	const video = new Video({
		userId: req.user.id,
		...req.body,
	});
	try {
		const createdVideo = await video.save();
		res.status(200).json(createdVideo);
	} catch (err) {
		next(err);
	}
};

export const getVideo = async (req, res, next) => {
	try {
		const foundVideo = await Video.findById(req.params.id);
		res.status(200).json(foundVideo);
	} catch (err) {
		next(err);
	}
};

export const updateVideo = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);
		if (!video) return next(createError(404, "Video could not be found"));
		if (req.user.id === video.userId) {
			const updatedVideo = await Video.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
			res.status(200).json(updatedVideo);
		} else {
			return next(createError(403, "You can update only your own videos"));
		}
	} catch (err) {
		next(err);
	}
};

export const deleteVideo = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);
		if (!video) return next(createError(404, "Video could not be found"));
		if (req.user.id === video.userId) {
			await Video.findByIdAndDelete(req.params.id);
			const comments = await Comment.find({ videoId: req.params.id })
			comments?.length > 0 && await Promise.all(
				comments.map(async(comment) => {
					await Comment.findByIdAndDelete(comment._id)
				})
			)
			res.status(200).json("Video deleted successfully!");
		} else {
			return next(403, "You can only delete your own videos!");
		}
	} catch (err) {
		next(err);
	}
};

export const addView = async (req, res, next) => {
	try {
		const video = await Video.findByIdAndUpdate(
			req.params.id,
			{ $inc: { views: 1 } },
			{ new: true }
		);
		res.status(200).json(video);
	} catch (err) {
		next(err);
	}
};

export const randomVideos = async (req, res, next) => {
	try {
		const videos = await Video.aggregate([{ $sample: { size: 30 } }]);
		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

export const trendVideos = async (req, res, next) => {
	try {
		// sort videos descending order of the amount of views
		const videos = await Video.find().sort({ views: -1 });
		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

export const channelVideos = async(req, res, next) => {
	try {
		const {channelId} = req.params
		const videos = await Video.find({ userId: channelId })
		res.status(200).json(videos)
	} catch (err) {
		next(err)
	}
}

export const subsVideos = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		const subsribedChannelIds = user.subscribedUsers;
		// multiple get requests
		const list = await Promise.all(
			subsribedChannelIds.map(async (channelId) => {
				return await Video.find({ userId: channelId });
			})
		);
		//list returns nested array
		// flat() -> get rid of nested array. sort() -> get the newest first
		res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
	} catch (err) {
		next(err);
	}
};

export const getTags = async (req, res, next) => {
	const tags = req.query.tags.split(",");
	try {
		const videos = await Video.find({ tags: { $in: tags } }).limit(20);
		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

export const search = async (req, res, next) => {
	const query = req.query.q;
	try {
		const videos = await Video.find({
			$or:[
			{tags: { $regex: query, $options: "i" }}, 
			{title: { $regex: query, $options: "i" }}]
		}).limit(40);
		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

export const getLikedVideos = async (req, res, next) => {
	try {
		const videos = await Video.find({ likes: req.user.id})
		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};


export const like = async(req, res, next) => {
	const userId = req.user.id
	const videoId = req.params.videoId
	try {
		const video = await Video.findByIdAndUpdate(videoId, {
			$addToSet: {likes: userId},
			$pull:{dislikes: userId}
		}, {new:true})
		res.status(200).json("You like the video")
	} catch (err) {
		next(err)
	}
}

export const dislike = async(req, res, next) => {
	const userId = req.user.id
	const videoId = req.params.videoId
	try {
		const video = await Video.findByIdAndUpdate(videoId, {
			$addToSet: {dislikes: userId},
			$pull:{likes: userId}
		}, {new:true})
		res.status(200).json("You dislike the video")
	} catch (err) {
		next(err)
	}
}