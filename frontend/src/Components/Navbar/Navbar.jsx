import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("signin");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Logged-in state based on JWT in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const userName = localStorage.getItem("name");

  // Keep Navbar in sync if localStorage changes (e.g., in other tabs)
  useEffect(() => {
    function checkAuth() {
      setIsLoggedIn(!!localStorage.getItem("access"));
    }
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // ✅ LOGOUT
  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/");
  }

  // ✅ SIGN UP
  async function signup(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const r = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Signup failed");

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

  // ✅ SIGN IN
  async function signin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const r = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Sign in failed");

      // Backend returns: ok, name, access, refresh
      setMsg(`Welcome, ${data.name}!`);

      // Save tokens + user info
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", email);

      setIsLoggedIn(true);
      // Close modal after a short delay
      setTimeout(() => setOpen(false), 500);
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className="container" style={{ position: "relative" }}>

      <ul>
        {/* ✅ Logged in view */}
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/become-provider" className="btn">
                Become a Provider
              </Link>
            </li>

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
          // ✅ Logged out view
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

      {/* ✅ SIGN IN / SIGN UP MODAL */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              width: 360,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tabs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <button
                className="btn"
                style={{ opacity: tab === "signin" ? 1 : 0.5 }}
                onClick={() => setTab("signin")}
              >
                Sign in
              </button>

              <button
                className="btn"
                style={{ opacity: tab === "signup" ? 1 : 0.5 }}
                onClick={() => setTab("signup")}
              >
                Sign up
              </button>
            </div>

            {/* SIGN IN FORM */}
            {tab === "signin" ? (
              <>
                <h3 style={{ marginTop: 0 }}>Welcome back</h3>
                <form onSubmit={signin} style={{ display: "grid", gap: 10 }}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </>
            ) : (
              // SIGN UP FORM
              <>
                <h3 style={{ marginTop: 0 }}>Create your account</h3>
                <form onSubmit={signup} style={{ display: "grid", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="UIC email (must end with @uic.edu)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Sign up"}
                  </button>
                </form>
              </>
            )}

            {/* MESSAGE */}
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

            {/* CLOSE BUTTON */}
            <div style={{ textAlign: "right", marginTop: 10 }}>
              <button className="btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
