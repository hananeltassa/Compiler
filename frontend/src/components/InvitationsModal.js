import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../styles/InvitationsModal.module.css";

const InvitationsModal = ({ fileId, onClose }) => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleChanges, setRoleChanges] = useState({});
    
    // Ref to track if data is fetched to avoid re-fetching
    const hasFetchedRef = useRef(false);

    // Access the file list from the Redux store
    const files = useSelector((state) => state.file.files);

    // Find the file based on its name and get the file ID
    const file = files.find((f) => f.name === fileId);
    const fileIdForRequest = file ? file.id : null;

    useEffect(() => {
        // Avoid making a new request if no valid fileId or data has already been fetched
        if (!fileIdForRequest || hasFetchedRef.current) return;
    
        const fetchInvitations = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/invitations/${fileIdForRequest}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
    
                if (response.data.message) {
                    setError(response.data.message);
                } else {
                    setInvitations(response.data);
                }
            } catch (err) {
                setError("Failed to fetch invitations");
            } finally {
                setLoading(false);
                hasFetchedRef.current = true;  // Mark as fetched to avoid multiple calls
            }
        };
    
        fetchInvitations();
    }, [fileIdForRequest]); 

    const handleRoleChange = (invitationId, newRole) => {
        setRoleChanges((prev) => ({
            ...prev,
            [invitationId]: newRole,
        }));
    };

    const handleSaveChanges = async (invitationId) => {
        const newRole = roleChanges[invitationId];
        if (!newRole) return;

        try {
            await axios.post(
                `http://127.0.0.1:8000/api/invitations/role`,
                { role: newRole, id: invitationId },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            // Update the invitations state with the new role
            const updatedInvitations = invitations.map((invitation) =>
                invitation.id === invitationId ? { ...invitation, role: newRole } : invitation
            );
            setInvitations(updatedInvitations);
            // Remove the invitationId from roleChanges after saving
            setRoleChanges((prev) => {
                const { [invitationId]: _, ...rest } = prev;
                return rest;
            });
        } catch (error) {
            setError("Failed to update role");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Collaborators</h2>

                {loading && <p>Loading...</p>}
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.tableContainer}>
                    {invitations.length > 0 ? (
                        <table className={styles.invitationTable}>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Change Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map((invitation) => (
                                    <tr key={invitation.id}>
                                        <td>{invitation.invited_email}</td>
                                        <td>{invitation.role}</td>
                                        <td>{invitation.status}</td>
                                        <td>
                                            <select
                                                value={roleChanges[invitation.id] || invitation.role}
                                                onChange={(e) => handleRoleChange(invitation.id, e.target.value)}
                                            >
                                                <option value="editor">Editor</option>
                                                <option value="viewer">Viewer</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleSaveChanges(invitation.id)}
                                                className={styles.saveBtn}
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !loading && <p>No collaborators found for this file.</p>
                    )}
                </div>

                <button onClick={onClose} className={styles.closeBtn}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default InvitationsModal;
