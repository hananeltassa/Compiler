import { Editor } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import DropdownButton from "./DropDown";
import { CODE_SNIPPETS } from "../constant";
import styles from "../styles/CodeEditor.module.css";
import OutPut from "./OutPut";
import { executeCode } from "./api";
import { useFileContent } from "../contexts/FileContentContext"; // Import context
import axios from "axios";
import Modal from "../components/Modal";

const CodeEditor = () => {
    const { fileContent, language, setLanguage } = useFileContent(); // Get context values and updater
    const [value, setValue] = useState(fileContent || "");
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [analysis, setAnalysis] = useState("");

  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

    useEffect(() => {
        if (fileContent) {
            setValue(fileContent);
        }
    }, [fileContent]);

    const handleLanguageSelect = (lang) => {
        setLanguage(lang); 
        setValue(CODE_SNIPPETS[lang]); 
    };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      setError("Please write some code before running.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { run } = await executeCode(language, sourceCode);
      setOutput(run.output.split("\n"));
    } catch (err) {
      setError("An error occurred while running the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      alert("No code available for analysis. Please write some code.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/analyze",
        {
          code: sourceCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAnalysis(response.data.analysis);
      //alert("Code Analysis:\n" + response.data.analysis);
    } catch (error) {
      console.error("Error analyzing code:", error);
      alert("Failed to analyze code. Please try again.");
    }
  };

  return (
    <div className={styles.editorContainer}>
      <h3 className={styles.languageHeader}>LANGUAGES</h3>

      {/* Dropdown and Run Button on the same line */}
      <div className={styles.controlsContainer}>
        <DropdownButton
          className={styles.dropdownButton}
          language={language}
          handleLanguageSelect={handleLanguageSelect}
        />
        <div className={styles.bttnsContainer}>
          <button
            className={styles.runButton}
            onClick={runCode}
            disabled={loading}
          >
            {loading ? "Running..." : "Run Code"}
          </button>
          <button className={styles.analyisBttn} onClick={handleAnalyzeCode}>
            Analyze Code
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        <Editor
          className={styles.editor}
          theme="vs-dark"
          language={language}
          value={value}
          onChange={(value) => setValue(value)}
          onMount={onMount}
          defaultValue={CODE_SNIPPETS[language]}
        />
        <OutPut output={output} />
        <Modal analysis={analysis} />
      </div>

      {loading && <p className={styles.loadingMessage}>Loading...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default CodeEditor;
