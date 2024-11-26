import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addFile,
    setCurrentFile,
    setError,
    setLoading,
    setFiles,
} from "../redux/features/fileSlice";
import axios from "axios";
import styles from "../styles/FileTabs.module.css";
import InviteUserForm from "./InviteUserForm";
import { useFileContent } from "../contexts/FileContentContext";

const FileTabs = () => {
    const dispatch = useDispatch();
    const files = useSelector((state) => state.file.files);
    const currentFile = useSelector((state) => state.file.currentFile);
    const { setFileContent, setLanguage } = useFileContent(); // Use the context to manage file content and language

    const [showInviteForm, setShowInviteForm] = useState(false);
    const [showFileInputs, setShowFileInputs] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [newFileLanguage, setNewFileLanguage] = useState("javascript");

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get("http://localhost:8000/api/files", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                dispatch(setFiles(response.data.files));
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to fetch files";
                dispatch(setError(errorMessage));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchFiles();
    }, [dispatch]);

    const handleFileSelect = async (fileName) => {
        dispatch(setCurrentFile(fileName));

        try {
            const response = await axios.get(`http://localhost:8000/api/files/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const fileContent = response.data.content;
            const fileLanguage = response.data.language;
            setFileContent(fileContent); // Update content via context
            setLanguage(fileLanguage); // Update language via context
        } catch (error) {
            dispatch(setError("Failed to load file content"));
        }
    };

    const handleCreateFile = () => {
        setShowFileInputs(true);
        setNewFileName("");
        setNewFileLanguage("javascript");
    };

    const handleSaveFile = async () => {
        if (!newFileName.trim()) {
            dispatch(setError("File name cannot be empty"));
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/files",
                {
                    name: newFileName.trim(),
                    language: newFileLanguage,
                    content: "", // Default content for a new file
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            dispatch(addFile(response.data.file)); // Add the new file to Redux state
            setShowFileInputs(false);
        } catch (error) {
            dispatch(setError("Failed to create file"));
        }
    };

    const handleInvite = () => {
        setShowInviteForm(true);
    };

    const handleCloseInviteForm = () => {
        setShowInviteForm(false);
    };

    return (
        <div className={styles.sidebarContainer}>
            {/* Button to create a new file */}
            <button
                onClick={handleCreateFile}
                className={styles.newFileBtn}
                title="Create New File"
            >
                +
            </button>

            {/* Inputs for new file details */}
            {showFileInputs && (
                <div className={styles.fileInputContainer}>
                    <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="Enter file name..."
                        autoFocus
                        className={styles.fileNameInput}
                    />
                    <select
                        value={newFileLanguage}
                        onChange={(e) => setNewFileLanguage(e.target.value)}
                        className={styles.fileLanguageSelect}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="php">PHP</option>
                        <option value="java">Java</option>
                        {/* Add other languages as needed */}
                    </select>
                    <button
                        onClick={handleSaveFile}
                        className={styles.saveFileBtn}
                    >
                        Save
                    </button>
                </div>
            )}

            {/* Display the list of files */}
            <div className={styles.fileTabs}>
                {files.map((file) => (
                    <div
                        key={file.name}
                        className={
                            currentFile === file.name
                                ? styles.selectedTab
                                : styles.tab
                        }
                        onClick={() => handleFileSelect(file.name)}
                    >
                        {file.name}
                    </div>
                ))}
            </div>

            {/* File actions */}
            <div className={styles.fileActions}>
                <button onClick={handleInvite} className={styles.inviteBtn}>
                    Invite
                </button>
            </div>

            {/* Invite user form */}
            {showInviteForm && (
                <InviteUserForm
                    fileId={currentFile}
                    onClose={handleCloseInviteForm}
                />
            )}
        </div>
    );
};

export default FileTabs;
