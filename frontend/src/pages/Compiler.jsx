import CodeEditor from "../components/CodeEditor";
import DropdownButton from "../components/DropDown";
import styles from "../styles/compiler.module.css";



const Compiler = () => {
    return (
        <div className={styles.box}>
            <CodeEditor />
        </div>
    );
};
export default Compiler;
