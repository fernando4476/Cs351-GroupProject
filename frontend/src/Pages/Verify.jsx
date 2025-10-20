import React from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Verify() {
  const [sp] = useSearchParams();
  const status = sp.get("status");

  if (status === "success") {
    return (
      <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
        <h1>✅ Your email is verified</h1>
        <p>You can now sign in to UIC Marketplace.</p>
        <p><Link to="/">Go back to home</Link></p>
      </div>
    );
  }

  if (status === "failed" || status === "expired") {
    return (
      <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
        <h1>❌ Verification failed</h1>
        <p>The link may be invalid or expired. Please try signing up again.</p>
        <p><Link to="/">Go back to home</Link></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
      <h1>Verification</h1>
      <p>Waiting for verification status…</p>
      <p><Link to="/">Go back to home</Link></p>
      </div>
  );
}
