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

  const [channels, setChannels] = useState([]);


  // Switch between files
  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <FileTabs
          files={files}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onSaveFile={() => alert("Save File Logic Goes Here")}
          onInvite={() => alert("Invite Logic Goes Here")}
        />
      </div>
      <div className={styles.editorContainer}>
        <CodeEditor file={files.find((file) => file.name === selectedFile)} />
      </div>
    </div>
  );
};

export default Compiler;
