import {Editor} from "@monaco-editor/react";

const CodeEditor = () => {
    return (
        <div>
            <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />
        </div>
    );
};
export default CodeEditor;
