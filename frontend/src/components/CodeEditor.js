import axios from "axios";
import Modal from "./Modal";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constant";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  const [analyzing, setAnalyzing] = useState(false); // New state for analysis loading
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

  useEffect(() => {
    if (!currentFile) return;

    Pusher.logToConsole = true;

    const pusher = new Pusher("d147720fc37b1e8976ee", {
      cluster: "ap2",
    });

    console.log("Current file:", currentFile);

    const channel = pusher.subscribe(`file.${currentFile}`);

    channel.bind("FileUpdated", (event) => {
      console.log("File updated:", event);
      setValue(event.content);
    });

    // Clean up: unsubscribe when the component unmounts or the current file changes
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
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

    // Start loading when analysis begins
    setAnalyzing(true);
    
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
        setAnalyzing(false); // End loading when analysis finishes
      }, 200);
    } catch (error) {
      console.error("Error analyzing code:", error);
      alert("Failed to analyze code. Please try again.");
      setAnalyzing(false); // End loading in case of error
    }
  };

  const handleCodeChange = (newCode) => {
    setValue(newCode);
    console.log("Sending data:", { fileName: currentFile, content: newCode });
    axios
      .post(
        "http://localhost:8000/api/files/update",
        { fileName: currentFile, content: newCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("File updated successfully:", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error updating file:", error.response.data);
          alert(
            error.response.data.message ||
              "An error occurred while updating the file."
          );
        } else {
          console.error("Error:", error.message);
        }
      });
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
          <button
            className={styles.runButton}
            onClick={runCode}
            disabled={loading}
          >
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
          onChange={handleCodeChange}
          onMount={onMount}
          defaultValue={CODE_SNIPPETS[language]}
        />
        <OutPut output={output} />
        <Modal analysis={analysis} analyzing={analyzing} />

      </div>

      {loading && <p className={styles.loadingMessage}>Loading...</p>}
      {analyzing && <p className={styles.loadingMessage}>Analyzing code...</p>} {/* New loading indicator */}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default CodeEditor;
