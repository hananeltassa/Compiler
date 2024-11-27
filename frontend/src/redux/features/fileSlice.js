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
        updateFileContent: (state, action) => {
            const { fileName, content } = action.payload;
            const file = state.files.find((file) => file.name === fileName);
            if (file) {
                file.content = content;
            }
        },
    },
});

export const { setFiles, setCurrentFile, setLoading, setError, addFile, updateFileContent } =
    fileSlice.actions;

export default fileSlice.reducer;
