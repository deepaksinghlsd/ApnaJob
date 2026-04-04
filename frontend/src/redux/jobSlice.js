import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        externalJobs:[], // New field for Tavily search results
    },
    reducers:{
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        setExternalJobs:(state,action) => {
            state.externalJobs = action.payload;
        },
        updateExternalJob:(state,action) => {
            // Used for updating match scores etc.
            const index = state.externalJobs.findIndex(j => j.url === action.payload.url);
            if (index !== -1) {
                state.externalJobs[index] = { ...state.externalJobs[index], ...action.payload };
            }
        }
    }
});

export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    setExternalJobs,
    updateExternalJob
} = jobSlice.actions;

export default jobSlice.reducer;