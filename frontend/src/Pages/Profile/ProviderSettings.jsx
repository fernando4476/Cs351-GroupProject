// frontend/src/Pages/Profile/ProviderSettings.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderSettings.css';
import {
  fetchMe,
  updateProfile,
  fetchProviderProfile,
  fetchProviderServices,
  fetchProviderBookings,
  createServiceListing,
  updateService,
  deleteService,
} from '../../api/client';
import { resolveMediaUrl } from '../../utils/api';

const ProviderSettings = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  }, []);

  const [profile, setProfile] = useState(() => {
    const name = localStorage.getItem('name') || storedUser.username || 'Provider';
    const email = localStorage.getItem('email') || storedUser.email || 'provider@example.com';
    const avatar =
      localStorage.getItem('profilePic') ||
      storedUser.avatar ||
      'https://via.placeholder.com/180x180.png?text=Profile';
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

  useEffect(() => {
    const loadAll = async () => {
      try {
        const me = await fetchMe();
        const fullName = me?.full_name || [me?.first_name, me?.last_name].filter(Boolean).join(' ');
        setProfile((prev) => ({
          ...prev,
          displayName: fullName || prev.displayName,
          email: me?.email || prev.email,
          avatar: resolveMediaUrl(me?.photo) || prev.avatar,
        }));

        const provider = await fetchProviderProfile();
        if (provider?.id) {
          setProviderId(provider.id);
          const svc = await fetchProviderServices(provider.id);
          setServices(Array.isArray(svc) ? svc : []);
          const bookings = await fetchProviderBookings(provider.id);
          setAppointments(Array.isArray(bookings) ? bookings : []);
        }
      } catch (err) {
        console.error('Failed to load provider data', err);
      }
    };
    loadAll();
  }, []);

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

    updateProfile({ photo: file })
      .then((resp) => {
        const newAvatar = resolveMediaUrl(resp?.photo);
        if (newAvatar) {
          setProfile((prev) => ({ ...prev, avatar: newAvatar }));
          localStorage.setItem('profilePic', newAvatar);
        }
      })
      .catch((err) => console.error('Avatar update failed', err));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const [first_name = '', last_name = ''] = (profile.displayName || '').split(' ');
    updateProfile({
      first_name,
      last_name,
      photo: avatarFile || fileInputRef.current?.files?.[0],
    })
      .then((resp) => {
        const newAvatar = resolveMediaUrl(resp?.photo);
        if (newAvatar) {
          setProfile((prev) => ({ ...prev, avatar: newAvatar }));
          localStorage.setItem('profilePic', newAvatar);
        }
      })
      .catch((err) => console.error('Profile update failed', err));
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
        .then((svc) => setServices((prev) => [...prev, svc]))
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

  const handleDeleteService = (svc) => {
    if (!window.confirm('Delete this service?')) return;
    deleteService(svc.id)
      .then(() => setServices((prev) => prev.filter((s) => s.id !== svc.id)))
      .catch((err) => console.error('Delete service failed', err));
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
          {`< Back`}
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
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </label>
                <button type="submit" className="provider-save-btn">
                  Save
                </button>
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
                <ul className="provider-list">
                  {appointments.map((appt, idx) => (
                    <li key={`${appt.id || idx}`}>
                      <strong>{appt?.service?.title || 'Appointment'}</strong>
                      <div className="muted">
                        {[appt.date, appt.time].filter(Boolean).join(' ')}
                        {` | `}
                        {appt?.customer?.full_name ||
                          [appt?.customer?.first_name, appt?.customer?.last_name]
                            .filter(Boolean)
                            .join(' ') ||
                          appt?.customer?.username ||
                          'Customer'}
                      </div>
                      {appt?.note ? <div className="muted">{appt.note}</div> : null}
                    </li>
                  ))}
                </ul>
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

    </div>
  );
};

export default ProviderSettings;




