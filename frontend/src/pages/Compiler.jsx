import { useState, useEffect } from "react";
import CodeEditor from "../components/CodeEditor";
import FileTabs from "../components/FileTabs";
import { CODE_SNIPPETS } from "../constant";
import styles from "../styles/compiler.module.css";
import Pusher from "pusher-js";
import axios from "axios";

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
  };

  useEffect(() => {
    if (files.length === 0) return;

    const pusher = new Pusher("d147720fc37b1e8976ee", {
      cluster: "ap2",
    });

    const newChannels = [];

    // Subscribe to Pusher channels for all files
    files.forEach((file) => {
      const channel = pusher.subscribe(`file-${file.id}`);
      newChannels.push(channel);

      // Bind to 'file-updated' event
      channel.bind("file-updated", (data) => {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id ? { ...f, content: data.content } : f
          )
        );
      });
    });

    // Save the channels state for cleanup
    setChannels(newChannels);

    // Cleanup on unmount or when files change
    return () => {
      newChannels.forEach((channel) => {
        channel.unsubscribe();
      });
      pusher.disconnect();
    };
  }, [files]); // Only re-run when files change

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
        <CodeEditor file={files.find((file) => file.name === selectedFile)} />
      </div>
    </div>
  );
};

export default Compiler;
