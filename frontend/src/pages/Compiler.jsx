import { useState, useEffect } from "react";
import CodeEditor from "../components/CodeEditor";
import FileTabs from "../components/FileTabs";
import { CODE_SNIPPETS } from "../constant";
import styles from "../styles/compiler.module.css";

const Compiler = () => {
  const [selectedFile, setSelectedFile] = useState("newFile");
  const [files, setFiles] = useState([
    {
      name: "newFile",
      content: CODE_SNIPPETS.javascript,
      language: "javascript",
    },
  ]);

  // Create a new file
  const handleNewFile = () => {
    const newFile = {
      name: `newFile-${files.length + 1}`,
      content: CODE_SNIPPETS.javascript,
      language: "javascript",
    };
    setFiles([...files, newFile]);
    setSelectedFile(newFile.name);
  };

  // Switch between files
  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
    console.log(fileName);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <FileTabs
          files={files}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onNewFile={handleNewFile}
          onSaveFile={() => alert("Save File Logic Goes Here")}
          onInvite={() => alert("Invite Logic Goes Here")}
        />
      </div>
      <div className={styles.editorContainer}>
        <CodeEditor />
      </div>
    </div>
  );
};

export default Compiler;
