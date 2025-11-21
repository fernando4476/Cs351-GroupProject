import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Provider.css";
import { buildApiUrl, resolveMediaUrl } from "../../utils/api";
import { getAuthHeaders, getAccessToken } from "../../utils/auth";
import { fetchMyProviderProfile } from "../../api/client";

export default function ProviderProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    displayName: "",
    about: "",
    phone: "",
    image: "",
    location: "UIC Campus",
    hours: {
      MONDAY: "9:00 AM - 5:00 PM",
      TUESDAY: "9:00 AM - 5:00 PM",
      WEDNESDAY: "9:00 AM - 5:00 PM",
      THURSDAY: "9:00 AM - 5:00 PM",
      FRIDAY: "9:00 AM - 5:00 PM",
      SATURDAY: "10:00 AM - 2:00 PM",
      SUNDAY: "Closed"
    },
    services: [
      { name: "", description: "", price: "", duration: "" }
    ]
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [photoUpdating, setPhotoUpdating] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    let active = true;
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const profile = await fetchMyProviderProfile();
        if (!active || !profile) return;
        setExistingProfile(profile);
        setFormData((prev) => ({
          ...prev,
          displayName: profile.business_name || prev.displayName,
          about: profile.description || prev.about,
          phone: profile.phone || prev.phone,
          image: profile.photo ? resolveMediaUrl(profile.photo) : prev.image,
        }));
        setPhotoFile(null);
      } catch (err) {
        // ignore if profile not found for this user
      } finally {
        if (active) setProfileLoading(false);
      }
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const parseErrorMessage = (payload, fallback = "Unable to save provider profile") => {
    if (!payload) return fallback;
    if (typeof payload === "string") return payload;
    if (payload.detail) return payload.detail;
    if (payload.error) return payload.error;
    const messages = [];
    Object.values(payload).forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(value.join(" "));
      } else if (typeof value === "string") {
        messages.push(value);
      }
    });
    return messages.join(" ") || fallback;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHourChange = (day, value) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value
      }
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange("image", reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: "", description: "", price: "", duration: "" }]
    }));
  };

  const handlePhotoUpdateOnly = async () => {
    if (!existingProfile) {
      setStatus({
        type: "error",
        message: "Create a provider profile before updating the photo.",
      });
      return;
    }
    if (!photoFile) {
      setStatus({
        type: "error",
        message: "Choose a new photo to upload.",
      });
      return;
    }

    const payload = new FormData();
    payload.append("photo", photoFile);

    setPhotoUpdating(true);
    setStatus({ type: "info", message: "Updating profile photo..." });
    try {
      const response = await fetch(buildApiUrl("/auth/service-provider/me/"), {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
        },
        body: payload,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = parseErrorMessage(data);
        throw new Error(detail);
      }

      setExistingProfile(data);
      handleInputChange("image", data.photo ? resolveMediaUrl(data.photo) : "");
      setPhotoFile(null);
      setStatus({ type: "success", message: "Profile photo updated!" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to update photo.",
      });
    } finally {
      setPhotoUpdating(false);
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const ensureProviderProfile = async () => {
    const payload = new FormData();
    payload.append("business_name", formData.displayName);
    payload.append("description", formData.about);
    payload.append("phone", formData.phone || "");
    if (photoFile) {
      payload.append("photo", photoFile);
    }

    const response = await fetch(buildApiUrl("/auth/service-provider/"), {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: payload,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const detail = parseErrorMessage(data);
      throw new Error(Array.isArray(detail) ? detail.join(" ") : detail);
    }

    return response.json();
  };

  const createService = async (service) => {
    const response = await fetch(buildApiUrl("/services/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        title: service.name.trim(),
        description:
          service.description || formData.about || service.name.trim(),
        price: Number.parseFloat(service.price) || 0,
        duration: Number.parseInt(service.duration, 10) || 60,
        location: formData.location || "UIC Campus",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = parseErrorMessage(data, "Unable to save service");
      throw new Error(message);
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (!token) {
      setStatus({
        type: "error",
        message: "Please sign in before creating a provider profile.",
      });
      return;
    }

    if (!formData.displayName.trim()) {
      setStatus({ type: "error", message: "Business name is required." });
      return;
    }

    const servicesToCreate = formData.services.filter(
      (service) => service.name && service.name.trim()
    );

    if (servicesToCreate.length === 0) {
      setStatus({
        type: "error",
        message: "Add at least one service with a name.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "info", message: "Publishing your profile..." });

    try {
      await ensureProviderProfile();
      const created = [];
      for (const service of servicesToCreate) {
        const saved = await createService(service);
        created.push(saved);
      }
      window.dispatchEvent(new Event("providersUpdated"));
      window.dispatchEvent(new Event("servicesUpdated"));
      setStatus({
        type: "success",
        message: "Profile published! Redirecting to your listing...",
      });
      navigate(`/services/${created[0].id}`);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to publish provider profile.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="provider-form-container">
      <div className="provider-form">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
        <div className="form-header">
          <h1>Become a Service Provider</h1>
          <p>Fill out your information to create your provider profile</p>
        </div>
        {profileLoading && (
          <p className="form-status">Loading your provider profile…</p>
        )}
        {!profileLoading && existingProfile && (
          <p className="form-status form-status--info">
            Update your info or use the button below to change your profile
            photo.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Profile URL ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="e.g., cutz-by-jay"
                required
              />
              <small>This will be your profile URL: /provider/your-id</small>
            </div>

            <div className="form-group">
              <label>Business Name *</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="e.g., Cutz by Jay"
                required
              />
            </div>

            <div className="form-group">
              <label>Profile Photo</label>
              <div className="photo-upload-row">
                <div className="photo-preview">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" />
                  ) : (
                    <div className="photo-placeholder-sm">👤</div>
                  )}
                </div>
                <div className="photo-actions">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {formData.image && (
                    <button
                      type="button"
                      className="clear-photo-btn"
                      onClick={() => {
                        handleInputChange("image", "");
                        setPhotoFile(null);
                      }}
                    >
                      Remove photo
                    </button>
                  )}
                  {existingProfile && (
                    <button
                      type="button"
                      className="update-photo-btn"
                      onClick={handlePhotoUpdateOnly}
                      disabled={photoUpdating || !photoFile}
                    >
                      {photoUpdating ? "Saving photo..." : "Update profile photo"}
                    </button>
                  )}
                  <small>Square images look best. This preview will appear on your profile.</small>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>About Your Business</label>
              <textarea
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                placeholder="Tell customers about your services, experience, and what makes you unique..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="e.g., 773-123-4567"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Fantanos, 750 S Halsted St, Chicago"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div className="form-section">
            <h2>Business Hours</h2>
            <div className="hours-grid">
              {Object.entries(formData.hours).map(([day, time]) => (
                <div key={day} className="hour-input-group">
                  <label>{day}</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => handleHourChange(day, e.target.value)}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="form-section">
            <h2>Services & Pricing</h2>
            <div className="services-container">
              {formData.services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-header">
                    <input
                      type="text"
                      placeholder="Service name"
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                      className="service-name-input"
                    />
                    {formData.services.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeService(index)} 
                        className="remove-service-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <textarea
                    placeholder="Service description"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    rows="2"
                    className="service-description-input"
                  />
                  
                  <div className="service-details">
                    <div className="price-input-group">
                      <label>Price ($)</label>
                      <input
                        type="text"
                        placeholder="0"
                        value={service.price}
                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      />
                    </div>
                    <div className="duration-input-group">
                      <label>Duration (min)</label>
                      <input
                        type="text"
                        placeholder="0"
                        value={service.duration}
                        onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button type="button" onClick={addService} className="add-service-btn">
                + Add Another Service
              </button>
            </div>
          </div>

          {status.message && (
            <p className={`form-status form-status--${status.type}`}>
              {status.message}
            </p>
          )}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Publishing..." : "Create Provider Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
