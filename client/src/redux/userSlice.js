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
	},
});

export const { loginStart, loginSuccessful, loginFailed, logout } =
	userSlice.actions;
export default userSlice.reducer;
