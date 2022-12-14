import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentVideo: null,
	loading: false,
	error: false,
};

const videoSlice = createSlice({
	name: "video",
	initialState,
	reducers: {
		fetchStart: (state) => {
			state.currentVideo = null;
			state.loading = true;
			state.error = false;
		},
		fetchSuccessful: (state, action) => {
			state.currentVideo = action.payload;
			state.loading = false;
			state.error = false;
		},
		fetchFailed: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		like: (state, action) => {
			if (!state.currentVideo.likes.includes(action.payload)) {
				state.currentVideo.likes.push(action.payload);
				state.currentVideo.dislikes.splice(
					state.currentVideo.dislikes.findIndex(
						(userId) => userId === action.payload
					),
					1
				);
			}
		},
		dislike: (state, action) => {
			if (!state.currentVideo.dislikes.includes(action.payload)) {
				state.currentVideo.dislikes.push(action.payload);
				state.currentVideo.likes.splice(
					state.currentVideo.likes.findIndex(
						(userId) => userId === action.payload
					),
					1
				);
			}
		},
		deleteVideo: (state, action) => {
			state.currentVideo = null;
		},
		incrementView:(state, action) => {
			state.currentVideo.views = action.payload
		}
	},
});

export const { fetchStart, fetchSuccessful, fetchFailed, like, dislike, deleteVideo, incrementView } =
	videoSlice.actions;
export default videoSlice.reducer;
