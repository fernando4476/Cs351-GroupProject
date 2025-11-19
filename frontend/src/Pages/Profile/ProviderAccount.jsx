import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProviderAccount() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={() => navigate("/profile")}>← Back to Profile</button>

      <h1>Become a Provider</h1>
      <p>
        Welcome! This portal will allow you to apply as a service provider.
      </p>

      <p>(Backend coming soon — this is just the UI screen.)</p>
    </div>
  );
}
