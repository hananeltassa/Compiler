import styles from "../styles/Output.module.css";

const OutPut = ({output}) => {
    return <div className={styles.box}>{output ? output : <span>Click Run Code to see the output here</span>}</div>;
};
export default OutPut;
