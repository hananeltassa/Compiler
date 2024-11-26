import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../styles/InvitationsModal.module.css";

const InvitationsModal = ({ fileId, onClose }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access the file list from the Redux store
  const files = useSelector((state) => state.file.files);

  // Find the file based on its name and get the file ID
  const file = files.find((f) => f.name === fileId);
  const fileIdForRequest = file ? file.id : null;

  const [roleChanges, setRoleChanges] = useState({});

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!fileIdForRequest) {
        setError("Invalid file ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/invitations/${fileIdForRequest}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setInvitations(response.data);
      } catch (err) {
        setError("Failed to fetch invitations");
      } finally {
        setLoading(false);
      }
    };

    if (fileIdForRequest) {
      fetchInvitations();
    }
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
      await axios.put(
        `http://localhost:8000/api/invitations/${invitationId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const updatedInvitations = invitations.map((invitation) =>
        invitation.id === invitationId
          ? { ...invitation, role: newRole }
          : invitation
      );
      setInvitations(updatedInvitations);
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
                        onChange={(e) =>
                          handleRoleChange(invitation.id, e.target.value)
                        }
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
            <p>No collaborators found for this file.</p>
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
