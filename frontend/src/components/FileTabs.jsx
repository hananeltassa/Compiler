import React, { useState } from "react";
import styles from "../styles/FileTabs.module.css";
import InviteUserForm from "./InviteUserForm";

const FileTabs = ({ files, selectedFile, onFileSelect, onNewFile, onSaveFile, onInvite }) => {
    const [showInviteForm, setShowInviteForm] = useState(false);

    const handleInvite = () => {
        setShowInviteForm(true); // Show the invite form
    };

    const handleCloseInviteForm = () => {
        setShowInviteForm(false); // Close the invite form
    };

    return (
        <div className={styles.sidebarContainer}>
            {/* Button to create a new file */}
            <button onClick={onNewFile} className={styles.newFileBtn}>+</button>

            {/* Display the list of files */}
            <div className={styles.fileTabs}>
                {files.map((file) => (
                    <div
                        key={file.name}
                        className={selectedFile === file.name ? styles.selectedTab : styles.tab}
                        onClick={() => onFileSelect(file.name)}
                    >
                        {file.name}
                    </div>
                ))}
            </div>

            {/* Save File and Invite buttons */}
            <div className={styles.fileActions}>
                <button onClick={onSaveFile} className={styles.saveFileBtn}>Save File</button>
                <button onClick={handleInvite} className={styles.inviteBtn}>Invite</button>
            </div>

            {/* Show the invitation form */}
            {showInviteForm && <InviteUserForm fileId={selectedFile} onClose={handleCloseInviteForm} />}
        </div>
    );
};

export default FileTabs;
