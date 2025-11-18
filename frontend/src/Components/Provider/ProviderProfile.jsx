import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Provider.css";
import { buildApiUrl } from "../../utils/api";
import { getAuthHeaders } from "../../utils/auth";

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

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange("image", reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: "", description: "", price: "", duration: "" }]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const ensureProviderProfile = async () => {
    const response = await fetch(buildApiUrl("/auth/service-provider/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        business_name: formData.displayName,
        description: formData.about,
        phone: formData.phone,
      }),
    });

    if (response.ok) {
      return response.json();
    }

    const data = await response.json().catch(() => ({}));
    const detail =
      data?.detail || data?.error || "Unable to save provider profile";
    throw new Error(Array.isArray(detail) ? detail.join(" ") : detail);
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
        location: formData.location || "UIC Campus",
        image: formData.image || "",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data?.detail || data?.error || "Unable to save service";
      throw new Error(Array.isArray(message) ? message.join(" ") : message);
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
                      onClick={() => handleInputChange("image", "")}
                    >
                      Remove photo
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
              <label>Where do you work?</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Near SCE or remote sessions"
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
