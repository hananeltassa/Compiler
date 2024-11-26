import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "../styles/FileTabs.module.css";
import InviteUserForm from "./InviteUserForm";
import { useFileContent } from "../contexts/FileContentContext";
import { addFile, setCurrentFile, setError, setLoading, setFiles } from "../redux/features/fileSlice";

const FileTabs = () => {
    const dispatch = useDispatch();
    const files = useSelector((state) => state.file.files);
    const currentFile = useSelector((state) => state.file.currentFile);
    const { setFileContent, setLanguage } = useFileContent();

    const [showInviteForm, setShowInviteForm] = useState(false);
    const [showFileInputs, setShowFileInputs] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [showInvitationsModal, setShowInvitationsModal] = useState(false);
    const [invitations, setInvitations] = useState([]);

    const languageMap = {
        js: "javascript",
        php: "php",
        html: "html",
        css: "css",
        py: "python",
        java: "java",
    };

    const detectLanguage = (fileName) => {
        const extension = fileName.split(".").pop().toLowerCase();
        return languageMap[extension] || "text";
    };

    useEffect(() => {
        const fetchFiles = async () => {
            dispatch(setLoading(true));
            try {
                const response = await axios.get("http://localhost:8000/api/files", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                dispatch(setFiles(response.data.files));
            } catch (error) {
                dispatch(setError(error.response?.data?.message || "Failed to fetch files"));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchFiles();
    }, [dispatch]);

    const handleFileSelect = async (fileName) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/files/${fileName}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setFileContent(response.data.content);
            setLanguage(detectLanguage(fileName));
            dispatch(setCurrentFile(fileName));
        } catch (error) {
            dispatch(setError("Failed to load file content"));
        }
    };

    const handleCreateFile = () => {
        setShowFileInputs(true);
        setNewFileName("");
    };

    const handleSaveFile = async () => {
        if (!newFileName.trim()) {
            dispatch(setError("File name cannot be empty"));
            return;
        }

        const detectedLanguage = detectLanguage(newFileName);
        try {
            const response = await axios.post(
                "http://localhost:8000/api/files",
                { name: newFileName.trim(), language: detectedLanguage, content: "" },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            dispatch(addFile(response.data.file));
            setShowFileInputs(false);
        } catch (error) {
            dispatch(setError("Failed to create file"));
        }
    };

    const fetchInvitations = async (fileId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/files/${fileId}/invitations`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setInvitations(response.data); // Assuming the API returns an array of invitations
        } catch (error) {
            console.error("Failed to fetch invitations", error);
        }
    };

    return (
        <div className={styles.sidebarContainer}>
            {/* New File Button */}
            <button onClick={handleCreateFile} className={styles.newFileBtn} title="Create New File">
                +
            </button>

            {/* New File Inputs */}
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
                    <button onClick={handleSaveFile} className={styles.saveFileBtn}>
                        Save
                    </button>
                </div>
            )}

            {/* File Tabs */}
            <div className={styles.fileTabs}>
                {files.map((file) => (
                    <div
                        key={file.id}
                        className={currentFile === file.name ? styles.selectedTab : styles.tab}
                        onClick={() => handleFileSelect(file.name)}
                    >
                        {file.name}
                    </div>
                ))}
            </div>

            {/* File Actions */}
            <div className={styles.fileActions}>
                <button onClick={() => setShowInviteForm(true)} className={styles.inviteBtn}>
                    Invite
                </button>

                {currentFile && (
                    <button
                        onClick={() => {
                            setShowInvitationsModal(true);
                            fetchInvitations(currentFile);
                        }}
                        className={styles.viewInvitationsBtn}
                    >
                        View Invitations
                    </button>
                )}
            </div>

            {/* Invite User Form */}
            {showInviteForm && <InviteUserForm fileId={currentFile} onClose={() => setShowInviteForm(false)} />}
        </div>
    );
};

export default FileTabs;
