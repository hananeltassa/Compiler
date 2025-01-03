import { useNavigate } from "react-router-dom";
import styles from "../styles/auth.module.css";
import useForm from "../hooks/useForm";

const Login = () => {
    const navigate = useNavigate();
    const { form, updateForm } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            navigate("/compiler");
        } else {
            alert(data.message || "Login failed");
        }
    };

    return (
        <div className={styles.signupContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <label>Email</label>
                <input 
                    type="email" 
                    placeholder="Email" 
                    name="email" 
                    value={form.email}  
                    onChange={updateForm} 
                    required 
                />
                <label>Password</label>
                <input 
                    type="password" 
                    placeholder="Password" 
                    name="password" 
                    value={form.password} 
                    onChange={updateForm} 
                    required 
                />
                <button type="submit">Sign In</button>
                <p>
                    Do not have an account?
                    <span className={styles.loginLink} onClick={() => navigate("/")}>
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
