import React, {useState} from "react";
import styles from "../styles/DropDown.module.css";

function DropdownButton() {
    return (
        <div className={styles.dropdown}>
            <button className={styles.dropdownButton}>
                Actions <span className={styles.arrow}>▼</span>
            </button>
            {
                <div className={styles.dropdownMenu}>
                    <a href="#download" className={styles.dropdownItem}>
                        Download
                    </a>
                    <a href="#create-copy" className={styles.dropdownItem}>
                        Create a Copy
                    </a>
                    <a href="#mark-draft" className={styles.dropdownItem}>
                        Mark as Draft
                    </a>
                    <a href="#delete" className={styles.dropdownItem}>
                        Delete
                    </a>
                    <a href="#workshop" className={styles.dropdownItem}>
                        Attend a Workshop
                    </a>
                </div>
            }
        </div>
    );
}

export default DropdownButton;
