import { useState, useEffect } from "react";
import CodeEditor from "../components/CodeEditor";
import FileTabs from "../components/FileTabs";
import styles from "../styles/compiler.module.css";

const Compiler = () => {
  const [channels, setChannels] = useState([]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <FileTabs/>
      </div>
      <div className={styles.editorContainer}>
        <CodeEditor />
      </div>
    </div>
  );
};

export default Compiler;
