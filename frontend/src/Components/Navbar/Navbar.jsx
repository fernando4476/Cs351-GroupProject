import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  login as loginRequest,
  signup as signupRequest,
  fetchMe,
} from "../../api/client";

export const Navbar = ({
  fixed = true,
  showBackButton = false,
  backTo = "/",
  backLabel = "Home",
}) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 16,
  };

  const modalStyle = {
    background: "#fff",
    padding: 36,
    borderRadius: 18,
    width: 620,
    maxWidth: "96vw",
    boxShadow: "0 22px 60px rgba(0,0,0,0.18)",
  };

  const tabsStyle = { display: "flex", gap: 12, marginBottom: 16 };
  const tabButton = (active) => ({
    background: active ? "#0f9b63" : "#f3f4f6",
    color: active ? "#fff" : "#111",
    padding: "10px 18px",
    borderRadius: 14,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: active ? "0 8px 18px rgba(15,155,99,0.25)" : "none",
    transition: "all 0.2s ease",
  });

  const inputStyle = {
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    fontSize: 16,
  };

  const formStyle = { display: "grid", gap: 18, marginTop: 8 };
  const primaryButtonStyle = {
    background: "linear-gradient(90deg, #0f9b63 0%, #10b981 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "16px 18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(16,185,129,0.22)",
  };
  const subtleTextStyle = { marginTop: 8, color: "#6b7280", fontSize: 14 };

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );
  const userName = localStorage.getItem("name");

  useEffect(() => {
    function checkAuth() {
      setIsLoggedIn(!!localStorage.getItem("access"));
    }
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/");
  }

  const handleBackClick = () => {
    if (typeof backTo === "number") {
      navigate(backTo);
    } else {
      navigate(backTo || "/");
    }
  };

  async function signup(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await signupRequest({ name, email, password });
      setMsg("Verification email sent! Check your @uic.edu inbox.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function signin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const data = await loginRequest({ email, password });
      setMsg(`Welcome, ${data.name}!`);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      try {
        const me = await fetchMe();
        const fullName =
          me?.full_name ||
          [me?.first_name, me?.last_name].filter(Boolean).join(" ").trim();
        localStorage.setItem("name", fullName || data.name);
      } catch {
        localStorage.setItem("name", data.name);
      }
      localStorage.setItem("email", email);
      setIsLoggedIn(true);
      setTimeout(() => setOpen(false), 500);
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className={`navbar ${fixed ? "navbar--fixed" : "navbar--static"}`}>
      <div className="navbar__inner container">
        {showBackButton ? (
          <button className="nav-back-btn" onClick={handleBackClick}>
            ← {backLabel}
          </button>
        ) : (
          <div className="nav-back-placeholder" />
        )}
        <ul>
          {isLoggedIn ? (
            <>
              <li>
                <button
                  className="btn"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  {userName ? `${userName}'s Profile` : "Profile"}
                </button>
              </li>
              <li>
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                className="btn"
                onClick={() => {
                  setOpen(true);
                  setTab("signin");
                }}
              >
                Sign in
              </button>
            </li>
          )}
        </ul>

        {open && (
          <div style={overlayStyle} onClick={() => setOpen(false)}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <div style={tabsStyle}>
                <button
                  style={tabButton(tab === "signin")}
                  onClick={() => setTab("signin")}
                >
                  Sign in
                </button>
                <button
                  style={tabButton(tab === "signup")}
                  onClick={() => setTab("signup")}
                >
                  Sign up
                </button>
              </div>

              {tab === "signin" ? (
                <>
                  <h3 style={{ marginTop: 0 }}>Welcome back</h3>
                  <p style={subtleTextStyle}>
                    Access your account to book services.
                  </p>
                  <form onSubmit={signin} style={formStyle}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <button
                      style={primaryButtonStyle}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h3 style={{ marginTop: 0 }}>Create your account</h3>
                  <p style={subtleTextStyle}>Use your @uic.edu email.</p>
                  <form onSubmit={signup} style={formStyle}>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="email"
                      placeholder="UIC email (must end with @uic.edu)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <button
                      style={primaryButtonStyle}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Sign up"}
                    </button>
                  </form>
                </>
              )}

              {msg && (
                <div
                  style={{
                    marginTop: 10,
                    color:
                      msg.toLowerCase().includes("welcome") ||
                      msg.toLowerCase().includes("verification")
                        ? "green"
                        : "red",
                  }}
                >
                  {msg}
                </div>
              )}

              <div style={{ textAlign: "right", marginTop: 10 }}>
                <button
                  className="btn"
                  style={{ background: "#f3f4f6", color: "#111", borderRadius: 12 }}
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
