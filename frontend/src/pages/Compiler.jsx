import CodeEditor from "../components/CodeEditor";
import styles from "../styles/compiler.module.css";
const Compiler = () => {
    return (
        <div className={styles.box}>
            <CodeEditor />
        </div>
    );
};
export default Compiler;
