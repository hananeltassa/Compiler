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
    const [newFileName, setNewFileName] = useState(""); 

    const handleCreateFile = async () => {
        if (!newFileName.trim()) {
            dispatch(setError("File name cannot be empty."));
            return;
        }

        const newFile = {
            name: newFileName.trim(),
            content: "", 
        };

        try {
            dispatch(setLoading(true)); 

            // API call to create a new file
            const response = await axios.post(
                "http://localhost:8000/api/files",
                newFile,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );

            dispatch(addFile(response.data.file));
            dispatch(setCurrentFile(response.data.file.name)); 
            setNewFileName("");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create file";
            dispatch(setError(errorMessage)); 
        } finally {
            dispatch(setLoading(false)); 
        }
    };

    const handleFileSelect = (fileName) => {
        dispatch(setCurrentFile(fileName));
    };

    const handleInvite = () => {
        setShowInviteForm(true); // Show the invite form
    };

    const handleCloseInviteForm = () => {
        setShowInviteForm(false); // Close the invite form
    };

    return (
        <div className={styles.sidebarContainer}>
            {/* Input field to name the new file */}
            <div className={styles.newFileContainer}>
                <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Enter file name"
                    className={styles.newFileInput}
                />
                <button onClick={handleCreateFile} className={styles.newFileBtn}>Create</button>
            </div>

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
