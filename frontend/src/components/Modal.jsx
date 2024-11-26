import React from "react";
import styles from "../styles/Output.module.css";

const Modal = ({ analysis, onClose, onReAnalyze }) => {
  return (
    <div className={styles.box}>
      <div>
        <h4>AI Code Analysis</h4>
        <pre>{analysis}</pre>
      </div>
    </div>
  );
};

export default Modal;
