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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: form.username,
            email: form.email,
            password: form.password,
            password_confirmation: form.verifyPassword,
        };

        const response = await fetch("http://127.0.0.1:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);
    };
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
                <button type="submit" onClick={(e) => handleSubmit(e)}>
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
