import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
    name: 'file',
    initialState: {
        files: [],
        currentFile: null,
        loading: false,
        error: null,
    },
    reducers: {
        setFiles: (state, action) => {
            state.files = action.payload;
        },
        setCurrentFile: (state, action) => {
            state.currentFile = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addFile: (state, action) => {
            state.files.push(action.payload);
        },
    },
});

export const { setFiles, setCurrentFile, setLoading, setError, addFile } = fileSlice.actions;

export default fileSlice.reducer;
