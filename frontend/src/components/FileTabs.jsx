import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFile, setCurrentFile, setError, setLoading } from "../redux/features/fileSlice";
import axios from "axios";
import styles from "../styles/FileTabs.module.css";
import InviteUserForm from "./InviteUserForm";

const FileTabs = () => {
    const dispatch = useDispatch();
    const files = useSelector((state) => state.file.files); 
    const currentFile = useSelector((state) => state.file.currentFile); 
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false); // To toggle file name input
    const [newFileName, setNewFileName] = useState(""); // New file name input

    const handleCreateFile = () => {
        setShowNameInput(true); // Show the input to name the file
        setNewFileName(""); // Reset file name input
    };

    const handleSaveFileName = async () => {
        if (!newFileName.trim()) {
            dispatch(setError("File name cannot be empty."));
            return;
        }

        try {
            dispatch(setLoading(true));
            const response = await axios.post(
                "http://localhost:8000/api/files",
                { name: newFileName.trim(), content: "" },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const savedFile = response.data.file;
            dispatch(addFile(savedFile));
            dispatch(setCurrentFile(savedFile.name));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to save file";
            dispatch(setError(errorMessage));
        } finally {
            setShowNameInput(false); // Hide the input
            dispatch(setLoading(false));
        }
    };

    const handleFileSelect = (fileName) => {
        dispatch(setCurrentFile(fileName)); // Set the clicked file as the current file
    };

    const handleInvite = () => {
        setShowInviteForm(true); // Show the invite form
    };

    const handleCloseInviteForm = () => {
        setShowInviteForm(false); // Close the invite form
    };

    return (
        <div className={styles.sidebarContainer}>
            {/* Button to create a new file */}
            <button onClick={handleCreateFile} className={styles.newFileBtn}>+</button>

            {/* File name input */}
            {showNameInput && (
                <div className={styles.nameInputContainer}>
                    <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveFileName();
                        }}
                        placeholder="Enter file name..."
                        autoFocus
                        className={styles.fileNameInput}
                    />
                </div>
            )}

            {/* Display the list of files */}
            <div className={styles.fileTabs}>
                {files.map((file) => (
                    <div
                        key={file.name}
                        className={currentFile === file.name ? styles.selectedTab : styles.tab}
                        onClick={() => handleFileSelect(file.name)}
                    >
                        {file.name}
                    </div>
                ))}
            </div>

            {/* Save File and Invite buttons */}
            <div className={styles.fileActions}>
                <button className={styles.saveFileBtn}>Save File</button>
                <button onClick={handleInvite} className={styles.inviteBtn}>Invite</button>
            </div>

            {/* Show the invitation form */}
            {showInviteForm && <InviteUserForm fileId={currentFile} onClose={handleCloseInviteForm} />}
        </div>
    );
};

export default FileTabs;
