import React, {useState} from "react";
import styles from "../styles/DropDown.module.css";
import {LANGUAGE} from "../constant";

function DropdownButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState("javascript");
    const languages = Object.entries(LANGUAGE);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
                {language} <span className={styles.arrow}>▼</span>
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {languages.map(([lang, ver]) => (
                        <span key={lang} className={styles.dropdownItem} onClick={() => handleLanguageSelect(lang)}>
                            {`${lang} - ${ver}`}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownButton;
