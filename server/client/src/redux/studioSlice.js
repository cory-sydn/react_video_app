import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	channelVideos: [],
	channelComments: [],
	selectedVideoIds: [],
	selectedCommentIds: [],
	searchGuide: [],
	filteredVideoIds: [],
	filteredCommentIds: [],
	loading: false,
	error: false,
};

const studioSlice = createSlice({
	name: "studio",
	initialState,
	reducers: {
		fetchStart: (state) => {
			state.channelVideos = [];
			state.channelComments = [];
			state.selectedVideoIds = [];
			state.selectedCommentIds = [];
			state.searchGuide = [];
			state.filteredVideoIds = [];
			state.filteredCommentIds = [];
			state.loading = true;
			state.error = false;
		},
		fetchVideosSuccessful: (state, action) => {
			return {
				...state,
				channelVideos : action.payload,
				loading : false,
				error : false
			}
		},
		fetchCommentsSuccessful: (state, action) => {
			return {
				...state,
				channelComments: [...state.channelComments, ...action.payload],
				loading: false,
			};
		},
		fetchFailed: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		selectVideo: (state, action) => {
			if (state.selectedVideoIds.includes(action.payload)) {
				return {
					...state,
					selectedVideoIds : state.selectedVideoIds.filter( el => el !== action.payload)
				}
			} else {
				return {
					...state,
					selectedVideoIds : [...state.selectedVideoIds, action.payload]
				}
			}
		},
		selectComment: (state, action) => {
			if (state.selectedCommentIds.includes(action.payload)) {
				return {
					...state,
					selectedCommentIds : state.selectedCommentIds.filter( el => el !== action.payload)
				}
			} else {
				return {
					...state,
					selectedCommentIds : [...state.selectedCommentIds, action.payload]
				}
			}
		},
		selectAllVideos: (state) => {
			/**
			 * if all selected -> remove all
			 * if one or more selected -> add them all
			 * OR no one selected -> add them all
			 */
			if (state.selectedVideoIds.length === state.filteredVideoIds.length) {
				state.selectedVideoIds = [];
			} else {
				let ids = []
				state.filteredVideoIds.map((el) => ids = [...ids, el])
				state.selectedVideoIds = ids;
			}
		},
		selectAllComments: (state) => {
			if (state.selectedCommentIds.length === state.channelComments.length) {
				state.selectedCommentIds = [];
			} else {
				let ids = []
				state.channelComments.map((el) => ids = [...ids, el._id])
				state.selectedCommentIds = ids;
			}
		},
		resetSearchGuide: (state) => {
			state.searchGuide = []
		},
		updateSearchGuide: (state, action) => {
			state.searchGuide = [...state.searchGuide, action.payload]
		},
		removeSearchGuide: (state, action) => {
			state.searchGuide = state.searchGuide.filter(el => el !== state.searchGuide.at(action.payload))
		},
		filterVideos: (state, action) => {
			state.filteredVideoIds = [...new Set(action.payload)]
		},
		filterComment: (state, action) => {
			state.filteredCommentIds = [...new Set(action.payload)]
		}
	},
});

export const {
	fetchStart,
	fetchVideosSuccessful,
	fetchCommentsSuccessful,
	fetchFailed,
	selectVideo,
	selectComment,
	selectAllVideos,
	selectAllComments,
	filterVideos,
	filterComment,
	resetSearchGuide,
	updateSearchGuide,
	removeSearchGuide
} = studioSlice.actions;
export default studioSlice.reducer;

/**
 * all search process use searchGuide.
 * for videos its like -> [{title: tech}, {desc: viva}] ...
 * for comments its like -> [{desc: quam}, {desc: oris}] ...
 */