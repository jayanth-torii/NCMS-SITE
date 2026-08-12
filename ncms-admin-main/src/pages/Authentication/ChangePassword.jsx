import React, { useState, useEffect } from "react";
import { updatePassword } from "../../services/data.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.scss";

const ChangePassword = () => {
  document.title = "Change Password";
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.body.classList.add("admin-login-page");
    return () => {
      document.body.classList.remove("admin-login-page");
    };
  }, []);

  useEffect(() => {
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      if (!authUser) {
        window.location.href = "/login";
        localStorage.clear();
      } else {
        setUser(authUser.user || authUser);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("authUser"));
      if (storedUser) {
        setUser(storedUser.user || storedUser);
        setFormData((prev) => ({
          ...prev,
          email: storedUser.user?.email || storedUser.email || storedUser.username || "",
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Email is required.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        email: formData.email,
        newPassword: formData.newPassword,
      });
      setSuccess("Password updated successfully!");
      setFormData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="video-background-container">
        <video autoPlay loop muted playsInline id="bg-video">
          <source src="/Ncms_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <main className="login-main-content">
        <section className="branding-section">
          <div className="logo-container">
            <div className="logo-wrapper">
              <span className="logo-text">NCMS</span>
            </div>
          </div>
          <h1 className="main-heading">CHANGE<br />PASSWORD</h1>
          <p className="subtitle-text">Keep your account secure.</p>
          <p className="description-text">Update your admin password to continue managing your institution safely.</p>
        </section>

        <section className="login-section">
          <div className="glass-card">
            <form className="login-form" noValidate onSubmit={handleSubmit}>
              {error && (
                <div style={{ color: "#f87171", fontSize: "0.9rem", textAlign: "center", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "5px" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ color: "#4ade80", fontSize: "0.9rem", textAlign: "center", background: "rgba(74, 222, 128, 0.1)", padding: "10px", borderRadius: "5px" }}>
                  {success}
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="newPassword">New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <span
                    onClick={toggleShowNewPassword}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
                  >
                    {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <span
                    onClick={toggleShowConfirmPassword}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </span>
                </div>
              </div>

              <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
                <span className="btn-text">{loading ? "UPDATING..." : "UPDATE PASSWORD"}</span>
                <span className="loader"></span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChangePassword;
