import axios from "axios";
import Modal from "./Modal";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constant";
import { useRef, useState, useEffect } from "react";
import { useSelector } from 'react-redux'; 
import styles from "../styles/CodeEditor.module.css";
import { useFileContent } from "../contexts/FileContentContext";
import DropdownButton from "./DropDown";
import { executeCode } from "./api";
import OutPut from "./OutPut";
import Pusher from "pusher-js";

const CodeEditor = () => {
  const { fileContent, language, setLanguage } = useFileContent();
  const [value, setValue] = useState(fileContent || "");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const editorRef = useRef();

  // Get the current file from Redux store
  const currentFile = useSelector((state) => state.file.currentFile);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  useEffect(() => {
    setValue(fileContent);
  }, [fileContent]);

  const filePath = "http://localhost:8000/storage/files/zayan.js";
  useEffect(() => {
    if (!filePath) return;

    const pusher = new Pusher("d147720fc37b1e8976ee", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`file.${currentFile}`); 

    channel.bind("FileUpdated", function (data) {
      setValue(data.content);
    });

    return () => {
      pusher.unsubscribe(`file.${currentFile}`);
    };
  }, [currentFile]);

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

      setTimeout(() => {
        setAnalysis(response.data.analysis);
      }, 200);
      
    } catch (error) {
      console.error("Error analyzing code:", error);
      alert("Failed to analyze code. Please try again.");
    }
  };

  const saveFile = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      setError("No content to save.");
      return;
    }

    if (!currentFile) {
      setError("No file selected.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/files/update",
        {
          fileName: currentFile,
          content: sourceCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("File saved successfully!");
    } catch (error) {
      setError("Error saving file. Please try again.");
    }
  };

  return (
    <div className={styles.editorContainer}>
      <h3 className={styles.languageHeader}>LANGUAGES</h3>
      <div className={styles.controlsContainer}>
        <DropdownButton
          className={styles.dropdownButton}
          language={language}
          handleLanguageSelect={handleLanguageSelect}
        />
        <div className={styles.bttnsContainer}>
          {/* Run Button */}
          <button className={styles.runButton} onClick={runCode} disabled={loading}>
            {loading ? "Running..." : "Run Code"}
          </button>

          {/* Analyze Button */}
          <button className={styles.analyisBttn} onClick={handleAnalyzeCode}>
            Analyze Code
          </button>

          {/* Save Button */}
          <button className={styles.saveButton} onClick={saveFile}>
            Save File
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        <Editor
          className={styles.editor}
          theme="vs-dark"
          language={language}
          value={value}
          onChange={setValue}
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
