import {Editor} from "@monaco-editor/react";
import {useRef, useState} from "react";
import DropdownButton from "./DropDown";
import {CODE_SNIPPETS} from "../constant";
import styles from "../styles/CodeEditor.module.css";
import OutPut from "./OutPut";
import {source} from "framer-motion/client";

const CodeEditor = () => {
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");
    const editorRef = useRef();
    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };
    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        setValue(CODE_SNIPPETS[lang]);
    };
    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        console.log(sourceCode);
    };
    return (
        <div>
            <h3 style={{display: "flex", alignitems: "flex-start"}}> Languages </h3>

            <DropdownButton language={language} handleLanguageSelect={handleLanguageSelect} />
            <div style={{display: "flex"}}>
                <Editor
                    height="75vh"
                    theme="vs-dark"
                    width="50%"
                    language={language}
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                    }}
                    onMount={onMount}
                    defaultValue={CODE_SNIPPETS[language]}
                />

                <OutPut />
            </div>
            <button onClick={runCode}>Run Code</button>
        </div>
    );
};
export default CodeEditor;
