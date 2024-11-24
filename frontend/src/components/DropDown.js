import React, {useState} from "react";
import styles from "../styles/DropDown.module.css";
import {LANGUAGE} from "../constant";

function DropdownButton() {
    const [isOpen, setIsOpen] = useState(false);
    const languages = Object.entries(LANGUAGE);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.dropdown}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
                Actions <span className={styles.arrow}>▼</span>
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {languages.map(([lang, ver]) => (
                        <span key={lang} className={styles.dropdownItem}>
                            {`${lang} - ${ver}`}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownButton;
