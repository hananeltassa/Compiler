import React from "react";
import styles from "../styles/Output.module.css";

const Modal = ({ analysis, analyzing }) => {
  return (
    <div className={styles.box}>
      <div>
        <h4>AI Code Analysis</h4>

        {/* Show loading indicator if analyzing */}
        {analyzing ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Analyzing code...</p>
          </div>
        ) : (
          <pre>{analysis || "No analysis available"}</pre>
        )}
      </div>
    </div>
  );
};

export default Modal;

