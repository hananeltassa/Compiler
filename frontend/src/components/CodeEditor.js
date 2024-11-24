import {Editor} from "@monaco-editor/react";

const CodeEditor = () => {
    return (
        <div>
            <Editor height="75vh" theme="vs-dark" defaultLanguage="javascript" defaultValue="// some comment" />
        </div>
    );
};
export default CodeEditor;
