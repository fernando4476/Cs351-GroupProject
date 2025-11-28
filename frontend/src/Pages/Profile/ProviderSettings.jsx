// frontend/src/Pages/Profile/ProviderSettings.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderSettings.css';
import {
  updateProfile,
  fetchProviderProfile,
  fetchProviderServices,
  fetchProviderBookings,
  createServiceListing,
  updateService,
  deleteService,
  updateProviderProfile,
  fetchProviderReviews,
  fetchProviderRating,
} from '../../api/client';
import { resolveMediaUrl } from '../../utils/api';

const ProviderSettings = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem('email');
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  }, []);

  const [profile, setProfile] = useState(() => {
    const name = storedUser.username || 'Provider';
    const email = storedEmail || storedUser.email || 'provider@example.com';
    const avatar = storedUser.avatar || 'https://via.placeholder.com/180x180.png?text=Profile';
    return { displayName: name, email, avatar };
  });

  const [services, setServices] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('myServices')) || [];
    } catch {
      return [];
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('providerAppointments')) ||
        JSON.parse(localStorage.getItem('appointments')) ||
        []
      );
    } catch {
      return [];
    }
  });

  const [activeSection, setActiveSection] = useState('details');
  const [providerId, setProviderId] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [serviceStatus, setServiceStatus] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const provider = await fetchProviderProfile();
        if (provider?.id) {
          setProviderId(provider.id);
          setProfile((prev) => ({
            ...prev,
            displayName: provider.business_name || prev.displayName,
            avatar: resolveMediaUrl(provider.photo) || prev.avatar,
            email: prev.email,
          }));
          const svc = await fetchProviderServices(provider.id);
          setServices(Array.isArray(svc) ? svc : []);
          const bookings = await fetchProviderBookings(provider.id);
          setAppointments(Array.isArray(bookings) ? bookings : []);
          const revs = await fetchProviderReviews(provider.id);
          if (Array.isArray(revs)) setReviews(revs);
          const avg = await fetchProviderRating(provider.id);
          if (avg?.average_rating) setRating(Number(avg.average_rating));
        }
      } catch (err) {
        console.error('Failed to load provider data', err);
      }
    };
    loadAll();
  }, []);

  const refreshServices = async () => {
    if (!providerId) return;
    try {
      const svc = await fetchProviderServices(providerId);
      setServices(Array.isArray(svc) ? svc : []);
    } catch (err) {
      console.error('Failed to refresh services', err);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = ev.target?.result || profile.avatar;
      setProfile((prev) => ({ ...prev, avatar: preview }));
    };
    reader.readAsDataURL(file);

    updateProviderProfile({ photo: file })
      .then((resp) => {
        const newAvatar = resolveMediaUrl(resp?.photo);
        if (newAvatar) {
          setProfile((prev) => ({ ...prev, avatar: newAvatar }));
        }
      })
      .catch((err) => console.error('Avatar update failed', err));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProviderProfile({
      business_name: profile.displayName,
      photo: avatarFile || fileInputRef.current?.files?.[0],
    })
      .then((resp) => {
        const newAvatar = resolveMediaUrl(resp?.photo);
        if (resp?.business_name) {
          setProfile((prev) => ({ ...prev, displayName: resp.business_name }));
        }
        if (newAvatar) {
          setProfile((prev) => ({ ...prev, avatar: newAvatar }));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch((err) => console.error('Provider profile update failed', err));
  };

  const handleAddService = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get('name')?.trim();
    const description = form.get('description')?.trim();
    const price = parseFloat(form.get('price')) || 0;
    const duration = parseInt(form.get('duration'), 10) || 0;
    const location = form.get('location')?.trim() || '';

    if (!name) return;
    if (providerId) {
      createServiceListing({
        title: name,
        description: description || '',
        price,
        duration,
        location,
      })
        .then(() => {
          setServiceStatus("Service added");
          refreshServices();
        })
        .catch((err) => console.error('Create service failed', err));
    }
    e.target.reset();
  };

  const handleEditClick = (svc) => {
    setEditingService(svc);
    setEditForm({
      title: svc.title || svc.name || '',
      description: svc.description || '',
      price: svc.price ?? '',
      duration: svc.duration ?? '',
      location: svc.location || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateService = (e) => {
    e.preventDefault();
    if (!editingService) return;
    const payload = {
      title: editForm.title?.trim(),
      description: editForm.description || '',
      price: parseFloat(editForm.price) || 0,
      duration: parseInt(editForm.duration, 10) || 0,
      location: editForm.location || '',
    };
    updateService(editingService.id, payload)
      .then((updated) =>
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? { ...s, ...updated } : s)))
      )
      .catch((err) => console.error('Update service failed', err))
      .finally(() => setEditingService(null));
  };

  const handleDeleteService = async (svc) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(svc.id);
      setServiceStatus("Service deleted");
      await refreshServices();
    } catch (err) {
      console.error('Delete service failed', err);
      setServiceStatus("Delete failed");
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="provider-settings-page">
      <div className="provider-topbar">
        <button className="provider-back-btn" onClick={() => navigate('/profile')}>
          {`< Back to Profile`}
        </button>
        <button className="provider-signout-btn" onClick={handleSignOut}>Sign Out</button>
      </div>
      <div className="provider-settings">
      <section className="provider-card">
        <div className="provider-avatar-wrap">
          <img className="provider-avatar" src={profile.avatar} alt="avatar" />
          <span className="change-badge" onClick={handleAvatarClick}>Change</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
        <h2 className="provider-name">{profile.displayName}</h2>
        <p className="provider-email">{profile.email}</p>
        {rating !== null && (
          <button
            type="button"
            className="provider-rating-pill"
            onClick={() => setShowReviews(true)}
          >
            ⭐ {rating.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? '' : 's'}
          </button>
        )}
      </section>

      <div className="provider-right">
        <div className="provider-actions">
          <button
            className={`provider-action-btn ${activeSection === 'details' ? 'active' : ''}`}
            onClick={() => setActiveSection('details')}
          >
            Provider Details
          </button>
          <button
            className={`provider-action-btn ${activeSection === 'services' ? 'active' : ''}`}
            onClick={() => setActiveSection('services')}
          >
            Services
          </button>
          <button
            className={`provider-action-btn ${activeSection === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveSection('appointments')}
          >
            Appointments
          </button>
        </div>

        <div className="provider-panel">
          {activeSection === 'details' && (
            <section className="provider-section" id="details">
              <h2>Provider Details</h2>
              <form className="provider-form" onSubmit={handleProfileSave}>
                <label>
                  Display Name
                  <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  />
                </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </label>
                <button type="submit" className="provider-save-btn">
                  Save
                </button>
                {saved && <p className="provider-saved-text">Changes saved!</p>}
              </form>
            </section>
          )}

          {activeSection === 'services' && (
            <section className="provider-section provider-services" id="services">
              <h2>Services</h2>
              {services.length === 0 ? (
                <p className="empty">No services yet. Add one below.</p>
              ) : (
                <ul className="provider-list">
                  {services.map((svc, idx) => (
                  <li key={`${svc.id || idx}`} className="provider-service-item">
                    <div>
                      <strong>{svc.title || svc.name || 'Service'}</strong>
                      {svc.description ? <div className="muted">{svc.description}</div> : null}
                    </div>
                    <div className="provider-service-actions">
                      <button
                        type="button"
                        className="provider-chip-btn"
                        onClick={() => handleEditClick(svc)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                          className="provider-chip-btn danger"
                          onClick={() => handleDeleteService(svc)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <form className="provider-form" onSubmit={handleAddService}>
                <label>
                  Service Name
                  <input name="name" placeholder="e.g. Tutoring" />
                </label>
                <label>
                  Description
                  <textarea name="description" placeholder="Add details (optional)" />
                </label>
                <label>
                  Price
                  <input name="price" type="number" step="0.01" placeholder="e.g. 25.00" />
                </label>
                <label>
                  Duration (minutes)
                  <input name="duration" type="number" step="5" placeholder="e.g. 60" />
                </label>
                <label>
                  Location
                  <input name="location" placeholder="e.g. Chicago, IL" />
                </label>
                <button type="submit" className="provider-save-btn">
                  Add Service
                </button>
              </form>
            </section>
          )}

          {activeSection === 'appointments' && (
            <section className="provider-section provider-appointments" id="appointments">
              <h2>Appointments</h2>
              {appointments.length === 0 ? (
                <p className="empty">No appointments yet.</p>
              ) : (
                <div className="provider-appt-grid">
                  {appointments.map((appt, idx) => {
                    const customerName =
                      appt?.customer?.full_name ||
                      [appt?.customer?.first_name, appt?.customer?.last_name].filter(Boolean).join(' ') ||
                      appt?.customer?.username ||
                      'Customer';
                    const customerEmail = appt?.customer?.email || 'No email';
                    const customerAvatar =
                      resolveMediaUrl(appt?.customer?.photo) ||
                      'https://via.placeholder.com/64x64.png?text=User';
                    const dateTime = [appt.date, appt.time].filter(Boolean).join(' · ');
                    return (
                      <div className="provider-appt-card" key={`${appt.id || idx}`}>
                        <div className="provider-appt-left">
                          <img src={customerAvatar} alt={customerName} className="provider-appt-avatar" />
                          <div>
                            <div className="provider-appt-name">{customerName}</div>
                            <div className="provider-appt-email">{customerEmail}</div>
                          </div>
                        </div>
                        <div className="provider-appt-body">
                          <div className="provider-appt-service">
                            {appt?.service?.title || 'Appointment'}
                          </div>
                          <div className="provider-appt-meta">{dateTime}</div>
                          {appt?.note ? <div className="provider-appt-note">{appt.note}</div> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
      </div>

      {editingService && (
        <div className="provider-modal">
          <div className="provider-modal-content">
            <h3>Edit Service</h3>
            <form className="provider-form" onSubmit={handleUpdateService}>
              <label>
                Service Name
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Add details (optional)"
                />
              </label>
              <label>
                Price
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  name="duration"
                  type="number"
                  step="5"
                  value={editForm.duration}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Location
                <input
                  name="location"
                  value={editForm.location}
                  onChange={handleEditChange}
                />
              </label>

              <div className="provider-modal-actions">
                <button type="button" className="provider-chip-btn" onClick={() => setEditingService(null)}>
                  Cancel
                </button>
                <button type="submit" className="provider-save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviews && (
        <div className="provider-modal">
          <div className="provider-modal-content">
            <h3>Reviews</h3>
            <p className="modal-subtext">
              Average rating: {rating !== null ? rating.toFixed(1) : 'N/A'}
            </p>
            <div className="reviews-list-modal">
              {reviews.length === 0 ? (
                <p className="empty">No reviews yet.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id || `${rev.rating}-${rev.comment}`} className="review-row">
                    <div className="review-header">
                      <span className="review-rating-pill">⭐ {rev.rating}</span>
                      <span className="review-date">
                        {rev.created_at
                          ? new Date(rev.created_at).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                    <p className="review-comment">{rev.comment || 'No comment'}</p>
                  </div>
                ))
              )}
            </div>
            <div className="provider-modal-actions">
              <button
                type="button"
                className="provider-chip-btn"
                onClick={() => setShowReviews(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderSettings;

// Reviews modal appended at the end of the component render




