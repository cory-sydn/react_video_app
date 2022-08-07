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
			state.loading = true;
			state.error = false
		},
		fetchSuccessful: (state, action) => {
			state.currentVideo = action.payload;
			state.loading = false;
			state.error = false
		},
		fetchFailed: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { fetchStart, fetchSuccessful, fetchFailed, logout } =
	videoSlice.actions;
export default videoSlice.reducer;