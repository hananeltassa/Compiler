import React, {useState} from "react";
import styles from "../styles/DropDown.module.css";
import {LANGUAGE} from "../constant";

function DropdownButton({handleLanguageSelect, language}) {
    const [isOpen, setIsOpen] = useState(false);
    const languages = Object.entries(LANGUAGE);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLanguage = (lang) => {
        handleLanguageSelect(lang);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown} style={{display: "flex", alignitems: "flex-start"}}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
                {language} <span className={styles.arrow}>▼</span>
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {languages.map(([lang, ver]) => (
                        <span key={lang} className={styles.dropdownItem} onClick={() => handleLanguage(lang)}>
                            {`${lang} - ${ver}`}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownButton;
