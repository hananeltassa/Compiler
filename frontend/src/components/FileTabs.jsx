import React from "react";
import styles from "../styles/FileTabs.module.css"; // Add your CSS here

const FileTabs = ({ files, selectedFile, onFileSelect, onNewFile, onSaveFile, onInvite }) => {
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
                <button onClick={onInvite} className={styles.inviteBtn}>Invite</button>
            </div>
        </div>
    );
};

export default FileTabs;
