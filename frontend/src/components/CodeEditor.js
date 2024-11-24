import {Editor} from "@monaco-editor/react";
import {useRef, useState} from "react";
import DropdownButton from "./DropDown";
import {CODE_SNIPPETS} from "../constant";

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
    return (
        <div>
            <DropdownButton language={language} handleLanguageSelect={handleLanguageSelect} />

            <Editor
                height="75vh"
                theme="vs-dark"
                language={language}
                value={value}
                onChange={(value) => {
                    setValue(value);
                }}
                onMount={onMount}
                defaultValue="// some comment"
            />
        </div>
    );
};
export default CodeEditor;
