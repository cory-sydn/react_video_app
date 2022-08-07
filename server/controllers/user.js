import { createError } from "../error.js"
import User from "../models/User.js"


export const getUser = async(req, res, next) => {
	if(req.params.id) {
		try {
			const foundUser = await User.findById(req.params.id)
			const {password, ...userInfo} = foundUser._doc
			res.status(200).json(userInfo)
		} catch (err) {
			next(err)
		}
	} else {
		return next(createError(403, "User can not found"))
	}
}


export const updateUser = async(req, res, next) => {
	if(req.params.id === req.user.id) {
		try {
			const updatedUser = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body	
			}, {new:true})
			const {password, ...userInfo} = updatedUser._doc
			res.status(200).json(userInfo)
		} catch (err) {
			next(err)
		}
	} else {
		return next(createError(403, "You can update only your own account!"))
	}
}


export const deleteUser = async(req, res, next) => {
	if(req.params.id === req.user.id) {
		try {
			await User.findByIdAndDelete(req.params.id)
			res.status(201).json("User account is no longer exist")
		} catch (err) {
			next(err)
		}
	} else {
		return next(createError(403, "You can delete only your own account!"))
	}
}


export const subscribe = async(req, res, next) => {	
	if (!req.params.id) return next(createError(404, "Channel ID is required to subscribe"))
	if(req.user.id) {
		try {
			//update subscribed channel 
			await User.findByIdAndUpdate(req.params.id, {
				$inc:{subscribers: 1}
			})
			//update subsriber user
			await User.findByIdAndUpdate(req.user.id, {
				$push:{subscribedUser: req.params.id}
			})
			res.status(200).json("Subscription successful")
		} catch (err) {
			next(err)
		}
	}
}

export const unsubscribe = async(req, res, next) => {
	if (!req.params.id) return next(createError(404, "Channel ID is required to unsubscribe"))
	if(req.user.id) {
		try {
			await User.findByIdAndUpdate(req.params.id, {
				$inc:{subscribers: -1 }
			})
			await User.findByIdAndUpdate(req.user.id, {
				$pull:{subscribedUser: req.params.id}
			})
			res.status(200).json("Successfully unsubscribed")
		} catch (err) {
			next(err)
		}
	}
}


export const subChannels = async(req, res, next) => {
	if(req.user.id) {
		try {
			const user = await User.findById(req.user.id)
			const subsribedChannelIds = user.subscribedUsers

			const list = await Promise.all(
				subsribedChannelIds.map(async(channelId)=>{
					return await User.findById(channelId)
				})
			)
			res.status(200).json(list.flat())
		} catch (err) {
			next(err)
		}
	}
} 