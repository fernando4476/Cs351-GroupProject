import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Provider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load provider data from localStorage
    const providerData = localStorage.getItem(`provider::${id}`);
    if (providerData) {
      setProvider(JSON.parse(providerData));
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Provider Not Found</h1>
        <p>No provider with ID: {id}</p>
        <button onClick={() => navigate("/")}>Back to Services</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate("/")}>← Back to Services</button>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>{provider.displayName}</h1>
      </div>
      
      {/* About Section */}
      {provider.about && (
        <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
          <h2>About</h2>
          <p>{provider.about}</p>
        </div>
      )}

      {/* Contact Information */}
      <div style={{ background: '#e8f5e8', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
        <h2>Contact Information</h2>
        {provider.phone && <p><strong>Phone:</strong> {provider.phone}</p>}
        
        <h3 style={{ marginTop: '20px' }}>Business Hours</h3>
        {provider.hours && Object.entries(provider.hours).map(([day, hours]) => (
          <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span>{day}:</span>
            <span>{hours}</span>
          </div>
        ))}
      </div>

      {/* Services */}
      {provider.services && provider.services[0]?.name && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Services</h2>
          {provider.services.map((service, index) => (
            service.name && (
              <div key={index} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{service.name}</h3>
                  <span style={{ fontWeight: 'bold', color: '#6C9E7D' }}>${service.price}</span>
                </div>
                {service.description && <p>{service.description}</p>}
                {service.duration && <p><small>Duration: {service.duration} minutes</small></p>}
                <button style={{ background: '#6C9E7D', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px' }}>
                  Book This Service
                </button>
              </div>
            )
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button style={{ background: '#6C9E7D', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '25px', fontSize: '18px' }}>
          Book Appointment
        </button>
      </div>
    </div>
  );
}