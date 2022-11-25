import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentComment: null,
	loading: false,
	error: false,
};

const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {
		commentSuccessful: (state, action) => {
			state.currentComment = action.payload;
			state.loading = false;
			state.error = false;
		},
		commentFailed: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		like: (state, action) => {
			state.currentComment = action.payload.comment
			// if userId is not inside of the "likes" array, add userId.
			// check if user disliked before and remove userId from "dislikes"
			if (!state.currentComment.likes.includes(action.payload.userId)) {
				state.currentComment.likes.push(action.payload.userId);
				state.currentComment.dislikes.splice(
					state.currentComment.dislikes.findIndex(
						(userId) => userId === action.payload.userId
					),
					1
				);
			} else {
			// user may have liked before. remove from "likes" array
				state.currentComment.likes.splice(
					state.currentComment.likes.findIndex(
						(userId) => userId === action.payload.userId
					),
					1
				)
			}
		},
		dislike: (state, action) => {
			state.currentComment = action.payload.comment
			if (!state.currentComment.dislikes.includes(action.payload.userId)) {
				state.currentComment.dislikes.push(action.payload.userId);
				state.currentComment.likes.splice(
					state.currentComment.likes.findIndex(
						(userId) => userId === action.payload.userId
					),
					1
				);
			} else {
				state.currentComment.dislikes.splice(
					state.currentComment.dislikes.findIndex(
						(userId) => userId === action.payload.userId
					),
					1
				)
			}
		},
		deleteComment: (state, action) => {
			state.currentComment = null
		},
		editComment: (state, action) => {
			state.currentComment = action.payload;
		}
	},
});

export const { commentSuccessful, commentFailed, like, dislike, deleteComment, editComment } =
	commentSlice.actions;
export default commentSlice.reducer;
