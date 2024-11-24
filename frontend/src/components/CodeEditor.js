import {Editor} from "@monaco-editor/react";
import {useRef, useState} from "react";

const CodeEditor = () => {
    const [value, setValue] = useState("");
    const editorRef = useRef();
    return (
        <div>
            <Editor
                height="75vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                value={value}
                onChange={(value) => {
                    setValue(value);
                }}
                defaultValue="// some comment"
            />
        </div>
    );
};
export default CodeEditor;
