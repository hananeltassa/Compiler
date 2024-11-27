import axios from "axios";
import Modal from "./Modal";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constant";
import { useRef, useState, useEffect } from "react";
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

    const channel = pusher.subscribe(`file.${filePath}`);

    channel.bind("FileUpdated", function (data) {
      setValue(data.content);
    });

    return () => {
      pusher.unsubscribe(`file.${filePath}`);
    };
  }, [filePath]);

  const handleCodeChange = (newCode) => {
    setValue(newCode);

    // sending the updated code to the server to be saved and broadcasted
    axios
      .post(
        "http://localhost:8000/api/files/update",
        { content: newCode, filePath },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .catch((error) => {
        console.error("Error updating file:", error);
      });
  };

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
      console.log(language);
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
          onChange={handleCodeChange}
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
