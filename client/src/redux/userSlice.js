import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	loading: false,
	error: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.loading = true;
			state.error = false
		},
		loginSuccessful: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = false
		},
		loginFailed: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		logout: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = false;
		},
		subscription: (state, action) => {
			if(!state.currentUser.subscribedUsers.includes(action.payload)) {
				state.currentUser.subscribedUsers.push(action.payload);
			} else {
				state.currentUser.subscribedUsers.splice(
					state.currentUser.subscribedUsers.indexOf((
						channelId)=> channelId === action.payload
					), 1
				);
			}
		},
		changeImg: (state, action) => {
			state.currentUser.img =  action.payload
		}
	},
});

export const { loginStart, loginSuccessful, loginFailed, logout, subscription, changeImg } =
	userSlice.actions;
export default userSlice.reducer;
