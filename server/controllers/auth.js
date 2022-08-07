import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
	try {
		const salt = bcrypt.genSaltSync(10);
		const hashedPwd = bcrypt.hashSync(req.body.password, salt);
		const newUser = new User({ ...req.body, password: hashedPwd });

		const savedUser = await newUser.save();
		const { password, ...others } = savedUser._doc;
		const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
		res
			.cookie("access_token", token, { httpOnly: true })
			.status(201)
			.json(others);
	} catch (err) {
		next(err);
	}
};

export const signin = async (req, res, next) => {
	if (!req.body.name || !req.body.password)
		return next(createError(400, "User name and password are required!"));

	try {
		const user = await User.findOne({ name: req.body.name });
		if (!user) return next(createError(404, "User not found!"));

		const isCorrect = await bcrypt.compare(req.body.password, user.password);
		if (!isCorrect) return next(createError(401, "Password is wrong"));

		const token = jwt.sign({ id: user._id }, process.env.JWT);
		const { password, ...others } = user._doc;

		res
			.cookie("access_token", token, { httpOnly: true })
			.status(200)
			.json(others);
	} catch (err) {
		next(err);
	}
};

export const googleAuth = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT);
			res
				.cookie("access_token", token, { httpOnly: true })
				.status(200)
				.json(user._doc);
		} else if (!user) {
			const newUser = new User({ ...req.body, fromGoogle: true });
			const savedUser = await newUser.save();
			const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
			res
				.cookie("access_token", token, { httpOnly: true })
				.status(200)
				.json(savedUser._doc);
		}
	} catch (err) {
		next(err);
	}
};
