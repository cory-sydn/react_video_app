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
		commentStart: (state) => {
			state.loading = true;
			state.error = false;
		},
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
			if (!state.currentComment.likes.includes(action.payload)) {
				state.currentComment.likes.push(action.payload);
				state.currentComment.dislikes.splice(
					state.currentComment.dislikes.findIndex(
						(userId) => userId === action.payload
					),
					1
				);
			}
		},
		dislike: (state, action) => {
			if (!state.currentComment.dislikes.includes(action.payload)) {
				state.currentComment.dislikes.push(action.payload);
				state.currentComment.likes.splice(
					state.currentComment.likes.findIndex(
						(userId) => userId === action.payload
					),
					1
				);
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

export const { commentStart, commentSuccessful, commentFailed, like, dislike, deleteComment, editComment } =
	commentSlice.actions;
export default commentSlice.reducer;
