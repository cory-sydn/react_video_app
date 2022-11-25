import { axiosInstance } from "../../apiConfig";

export const DeleteComment = async (commentId) => {
	try {
		const res = await axiosInstance.delete(
			`/comments/${commentId}`,
			{ withCredentials: true }
		);
		return res;
	} catch (err) {
		console.log(err);
	}
};
