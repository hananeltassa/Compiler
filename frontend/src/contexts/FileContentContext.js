import React, { createContext, useContext, useState } from "react";

const FileContentContext = createContext();

export const FileContentProvider = ({ children }) => {
    const [fileContent, setFileContent] = useState("");
    const [language, setLanguage] = useState("javascript");

    return (
        <FileContentContext.Provider
            value={{ fileContent, setFileContent, language, setLanguage }}
        >
            {children}
        </FileContentContext.Provider>
    );
};

export const useFileContent = () => useContext(FileContentContext);
