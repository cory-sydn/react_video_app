import axios from "axios";
import { axiosInstance } from "../../apiConfig";

export const getVideos = async (userId, cancelToken) => {
	try {
		const res = await axiosInstance.get(
  		`/videos/${userId}`,
			{ cancelToken: cancelToken.token }
			);
		return res.data;
	} catch (err) {
		if (axios.isCancel(err)) return
		console.log(err);
	}
};