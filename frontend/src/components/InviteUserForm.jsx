import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/InviteUserForm.module.css";

const InviteUserForm = ({ fileId, onClose }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("editor");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const invitationData = {
            file_id: fileId,
            invited_email: email,
            role: role,
        };

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/invitations",
                invitationData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert(response.data.message);
            onClose(); 
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "An error occurred.");
            } else if (err.request) {
                setError("No response from the server. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Send Invitation</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Invitation"}
                        </button>
                    </div>
                </form>
                <button className={styles.closeBtn} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default InviteUserForm;
