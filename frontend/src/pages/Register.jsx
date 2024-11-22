import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/auth.module.css';


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

  
    const handleRegister = async (e) => {
        e.preventDefault();

    };

    return (
        <div className={styles.registerContainer}>
        <div className={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter Your Username"
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter your password"
                    />
                </div>


                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}

                <button type="submit">Register</button>
            </form>
        </div>
    </div>
    );
};

export default Register;
