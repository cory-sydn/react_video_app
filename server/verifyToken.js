import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) return next(createError(401, "Not authenticated"));

	jwt.verify(token, process.env.JWT, (err, userInfo) => {
		if (err) return next(createError(403, "Token is not valid!"));
		req.user = userInfo;
		next();
	});
};
