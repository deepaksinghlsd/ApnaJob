import { createSlice } from "@reduxjs/toolkit";

const authModalSlice = createSlice({
    name: "authModal",
    initialState: {
        isOpen: false,
        view: "login", // 'login' or 'signup'
    },
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.view = action.payload || "login";
        },
        closeModal: (state) => {
            state.isOpen = false;
        },
        setView: (state, action) => {
            state.view = action.payload;
        }
    }
});

export const { openModal, closeModal, setView } = authModalSlice.actions;
export default authModalSlice.reducer;
