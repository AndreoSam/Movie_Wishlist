import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { base_url } from "../../../Api/api";
import axios from "axios";

//movie list
export const movieList = createAsyncThunk("get/movieList", async ({ newstate, pageno }) => {
    // console.log(`http://www.omdbapi.com/?apikey=73fbe8af&s=${newstate}&type=movie&page=${pageno}`)
    let res = await axios.post(`http://www.omdbapi.com/?apikey=73fbe8af&s=${newstate}&type=movie&page=${pageno}`)
    return res?.data
})

//single movie data
export const singleMovie = createAsyncThunk("get/singleMovie", async (id) => {
    let res = await axios.post(`http://www.omdbapi.com/?apikey=73fbe8af&type=movie&i=${id}`)
    return res?.data
})

//wishlists movies
export const wishlistsMovie = createAsyncThunk("get/wishlistsMovie", async (mappedImdbIDs) => {
    // console.log("ID: ", mappedImdbIDs);
    const requests = mappedImdbIDs.map(mappedImdbIDs =>
        axios.post(`http://www.omdbapi.com/?apikey=73fbe8af&type=movie&i=${mappedImdbIDs}`)
    );
    const responses = await Promise.all(requests);
    return responses.map(response => response.data);
    // return requests?.data
})

const initialValues = {
    userData: [],
    loading: false,
    error: null,
};

export const mediaSlice = createSlice({
    name: "slice",
    initialState: initialValues,

    extraReducers: (builder) => {
        //allMovielist
        builder.addCase(movieList.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(movieList.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.error = null;
            // console.log("Fulfilled action: ", action.payload);
        });
        builder.addCase(movieList.rejected, (state, action) => {
            state.loading = false;
            state.userData = [];
            state.error = action.error.message;
            console.log("Rejected action: ", action);
        });

        //single movie data
        builder.addCase(singleMovie.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(singleMovie.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.error = null;
            // console.log("Fulfilled action: ", action.payload);
        });
        builder.addCase(singleMovie.rejected, (state, action) => {
            state.loading = false;
            state.userData = [];
            state.error = action.error.message;
            console.log("Rejected action: ", action);
        });

        //single movie data
        builder.addCase(wishlistsMovie.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(wishlistsMovie.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.error = null;
            // console.log("Fulfilled action: ", action.payload);
        });
        builder.addCase(wishlistsMovie.rejected, (state, action) => {
            state.loading = false;
            state.userData = [];
            state.error = action.error.message;
            console.log("Rejected action: ", action);
        });
    }
})

export default mediaSlice.reducer;