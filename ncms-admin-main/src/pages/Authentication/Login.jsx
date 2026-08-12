import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import withRouter from "components/Common/withRouter";
import { login, completeLogin } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

// Import Google Font and CSS
import "./Login.scss";

const Login = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [loginError, setLoginError] = useState("");

  // OTP step state. The OTP is generated + stored + verified on the backend;
  // in dev the backend returns it so the operator can enter it directly.
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [preAuthToken, setPreAuthToken] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Add custom class to body for the login page specific styling
    document.body.classList.add("admin-login-page");

    // Add Google Fonts link if not present
    const fontId = "outfit-font";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }

    return () => {
      document.body.classList.remove("admin-login-page");
    };
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Simple inline validation clearing
    if (id === "email") setEmailInvalid(false);
    if (id === "password") setPasswordInvalid(false);
    setLoginError("");
  };

  // Validate credentials (step 1) — the backend generates + stores a fresh OTP
  // and returns it so the operator can enter it. Reused by submit + resend.
  const requestOtp = async () => {
    const res = await dispatch(
      login({ email: data.email.trim(), password: data.password })
    ).unwrap();
    const toEmail = res.user?.email || data.email.trim();
    setPreAuthToken(res.preAuthToken);
    setSuccessMsg(
      res.otp
        ? `OTP sent to ${toEmail} — dev OTP: ${res.otp}`
        : `OTP sent to ${toEmail}`
    );
    return res;
  };

  // STEP 1 — validate credentials, then request the OTP.
  const handleValidSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email.trim())) {
      setEmailInvalid(true);
      isValid = false;
    }

    if (data.password.trim() === "") {
      setPasswordInvalid(true);
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    setLoginError("");
    setSuccessMsg("");

    try {
      setUserOtp("");
      setOtpError("");
      await requestOtp();
      setStep("otp");
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      setLoginError(
        typeof error === "string" ? error : "Invalid credentials or server error."
      );
    }
  };

  // STEP 2 — send the entered OTP to the backend, which verifies it against the
  // stored value and (on success) mints the real session token.
  const handleOtpVerify = async (event) => {
    event.preventDefault();
    setOtpError("");

    const entered = userOtp.trim();
    if (entered.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(completeLogin({ preAuthToken, otp: entered })).unwrap();

      setSuccessMsg("OTP verified! Redirecting...");
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        setLoading(false);
        window.location.href = "/dashboard";
      }, 1200);
    } catch (error) {
      console.error("OTP completion failed:", error);
      setLoading(false);
      setOtpError(
        typeof error === "string" ? error : "Invalid or expired OTP. Please try again."
      );
    }
  };

  // Resend re-runs step 1, which generates a NEW OTP server-side (replacing the
  // old one) and issues a fresh pre-auth token.
  const handleResendOtp = async () => {
    setResending(true);
    setOtpError("");
    try {
      setUserOtp("");
      await requestOtp();
    } catch (error) {
      setOtpError("Could not resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const backToCredentials = () => {
    setStep("credentials");
    setUserOtp("");
    setPreAuthToken("");
    setOtpError("");
    setSuccessMsg("");
  };

  const errorBox = (msg) => (
    <div style={{ color: "#f87171", fontSize: "0.9rem", textAlign: "center", marginBottom: "-10px", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "5px" }}>
      {msg}
    </div>
  );

  const successBox = (msg) => (
    <div style={{ color: "#4ade80", fontSize: "0.9rem", textAlign: "center", marginBottom: "-10px", background: "rgba(74, 222, 128, 0.1)", padding: "10px", borderRadius: "5px" }}>
      {msg}
    </div>
  );

  return (
    <div className="app-container">
      {/* Background Video Container */}
      <div className="video-background-container">
        <video autoPlay loop muted playsInline id="bg-video">
          <source src="/Ncms_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Main Content Area */}
      <main className="login-main-content">
        {/* Left Side: Branding */}
        <section className="branding-section">
          <div className="logo-container">
            <div className="logo-wrapper">
              <span className="logo-text">NCMS</span>
            </div>
          </div>
          <h1 className="main-heading">ADMIN<br />PORTAL</h1>
          <p className="subtitle-text">Manage your institution efficiently.</p>
          <p className="description-text">Access your dashboard to oversee college operations, staff, and student data.</p>
        </section>

        {/* Right Side: Login Card */}
        <section className="login-section">
          <div className="glass-card">
            {step === "credentials" ? (
              <form className="login-form" id="loginForm" noValidate onSubmit={handleValidSubmit}>
                {loginError && errorBox(loginError)}

                {/* Email Input Group */}
                <div className={`input-group ${emailInvalid ? "invalid" : ""}`}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    value={data.email}
                    onChange={handleInputChange}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                  />
                  <span className="error-message">Please enter a valid email address</span>
                </div>

                {/* Password Input Group */}
                <div className={`input-group ${passwordInvalid ? "invalid" : ""}`}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="**********"
                    required
                    autoComplete="current-password"
                    value={data.password}
                    onChange={handleInputChange}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                  />
                  <span className="error-message">Password is required</span>
                </div>

                {/* Sign In Button */}
                <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} id="submitBtn" disabled={loading}>
                  <span className="btn-text">SIGN IN</span>
                  <span className="loader"></span>
                </button>
              </form>
            ) : (
              <form className="login-form" id="otpForm" noValidate onSubmit={handleOtpVerify}>
                {otpError && errorBox(otpError)}
                {successMsg && successBox(successMsg)}

                {/* OTP Input Group */}
                <div className="input-group" style={{ marginTop: "20px" }}>
                  <label htmlFor="userOtp">Enter OTP</label>
                  <input
                    type="text"
                    id="userOtp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    required
                    autoComplete="one-time-code"
                    value={userOtp}
                    onChange={(e) => { setUserOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                  />
                  <span className="error-message">Please enter the 6-digit OTP</span>
                </div>

                {/* Verify Button */}
                <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading} style={{ marginTop: "30px" }}>
                  <span className="btn-text">VERIFY & SIGN IN</span>
                  <span className="loader"></span>
                </button>

                {/* Footer: resend + back */}
                <div className="form-footer" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <button type="button" className="signup-link" onClick={handleResendOtp} disabled={resending} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                  <button type="button" className="signup-link" onClick={backToCredentials} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
