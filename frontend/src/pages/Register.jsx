import {useNavigate} from "react-router-dom";
import styles from "../styles/auth.module.css";
import useForm from "../hooks/useForm";

const Register = () => {
    const navigate = useNavigate();
    const {form, updateForm} = useForm({
        username: "",
        email: "",
        password: "",
        verifyPassword: "",
    });
    function handleSubmit(e) {
        e.preventDefault();
    }
    return (
        <div className={styles.signupContainer}>
            <form className={styles.signupForm}>
                <h1>Sign Up</h1>
                Username
                <input type="text" placeholder="Username" name="username" onChange={updateForm} required />
                Email
                <input type="email" placeholder="Email" name="email" onChange={updateForm} required />
                Password
                <input type="password" placeholder="Password" name="password" onChange={updateForm} required />
                Verify Password
                <input
                    type="password"
                    placeholder="Verify your password"
                    name="verifyPassword"
                    onChange={updateForm}
                    required
                />
                <button type="submit" onClick={handleSubmit}>
                    Sign Up
                </button>
                <p>
                    Already have an account?
                    <span className={styles.loginLink} onClick={() => navigate("/login")}>
                        Log In
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;
