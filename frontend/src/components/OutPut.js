import styles from "../styles/Output.module.css";

const OutPut = ({output}) => {
    return (
        <div className={styles.box}>
            {output ? (
                output.map((index, i) => (
                    <span key={i}>
                        {index} <br />
                    </span>
                ))
            ) : (
                <span>Click Run Code to see the output here</span>
            )}
        </div>
    );
};
export default OutPut;
