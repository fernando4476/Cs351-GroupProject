import React, { useEffect, useState } from "react";
import "./Settings.css";
import "./ProviderSettings.css";
import { useNavigate } from "react-router-dom";
import { fetchMyReviews, updateMyReview, deleteMyReview } from "../../api/client";
import logo from "../../assets/logo.png";
import { resolveMediaUrl } from "../../utils/api";

export default function MyReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const profilePic = localStorage.getItem("profilePic") || logo;
  const name = localStorage.getItem("name") || "UIC Student";
  const email = localStorage.getItem("email") || "student@uic.edu";

  const load = async () => {
    try {
      const data = await fetchMyReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (rev) => {
    setEditingId(rev.id);
    setEditRating(rev.rating);
    setEditComment(rev.comment || "");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateMyReview(editingId, { rating: editRating, comment: editComment });
      setEditingId(null);
      setEditComment("");
      await load();
    } catch (err) {
      console.error("Failed to update review", err);
    }
  };

  const removeReview = async () => {
    if (!deleteId) return;
    try {
      await deleteMyReview(deleteId);
      await load();
    } catch (err) {
      console.error("Failed to delete review", err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-topbar">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <button
          className="signout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
            window.location.reload();
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="settings-layout">
        <div className="settings-profile-box">
          <div className="settings-avatar-wrap">
            <img src={profilePic} alt="Profile" className="settings-profile-pic" />
          </div>
          <h2 className="settings-profile-name">{name}</h2>
          <p className="settings-profile-email">{email}</p>
          <p className="settings-info-text">Manage your feedback for providers.</p>
        </div>

        <div className="settings-right-wrapper">
          <h1 className="settings-title">My Feedback</h1>

          {reviews.length === 0 ? (
            <p className="empty">You haven't left any reviews yet.</p>
          ) : (
            <div className="provider-appt-grid">
              {reviews.map((rev) => {
                const providerName =
                  rev?.provider?.business_name ||
                  [rev?.provider?.user?.first_name, rev?.provider?.user?.last_name]
                    .filter(Boolean)
                    .join(" ") ||
                  "Provider";
                const avatar = resolveMediaUrl(rev?.provider?.photo) || logo;
                const date = rev.created_at
                  ? new Date(rev.created_at).toLocaleString()
                  : "";
                const isEditing = editingId === rev.id;

                return (
                  <div className="provider-appt-card" key={rev.id}>
                    <div className="provider-appt-left">
                      <img src={avatar} alt={providerName} className="provider-appt-avatar" />
                      <div>
                        <div className="provider-appt-name">{providerName}</div>
                        <div className="provider-appt-email">{date}</div>
                      </div>
                    </div>
                    <div className="provider-appt-body">
                      {isEditing ? (
                        <>
                          <label className="modal-field">
                            Rating
                            <select
                              value={editRating}
                              onChange={(e) => setEditRating(Number(e.target.value))}
                            >
                              {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="modal-field">
                            Comment
                            <textarea
                              rows="3"
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                            />
                          </label>
                          <div className="provider-service-actions">
                            <button className="provider-chip-btn" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                            <button className="provider-save-btn" type="button" onClick={saveEdit}>
                              Save
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="provider-appt-service">⭐ {rev.rating}</div>
                          <div className="provider-appt-note">{rev.comment || "No comment"}</div>
                          <div className="provider-service-actions">
                            <button className="provider-chip-btn" onClick={() => startEdit(rev)}>
                              Edit
                            </button>
                            <button
                              className="provider-chip-btn danger"
                              onClick={() => setDeleteId(rev.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
      )}

      {deleteId && (
        <div className="provider-modal">
          <div className="provider-modal-content">
            <h3>Delete this review?</h3>
            <p className="modal-subtext">This action cannot be undone.</p>
            <div className="provider-modal-actions">
              <button
                type="button"
                className="provider-chip-btn"
                onClick={() => setDeleteId(null)}
              >
                Keep
              </button>
              <button
                type="button"
                className="provider-chip-btn danger"
                onClick={removeReview}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
