"use client";
import React, { useState } from "react";
import { User, Phone, Mail, GraduationCap, Send, BadgeCheck } from "lucide-react";
import { BASE_URL } from "@/config/apiService";

const PROGRAMS = ["B.Com", "BBA", "B.Sc", "MBA"];

const QueryForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    program: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const setField = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (formData.full_name.trim().length < 3) e.full_name = "Please enter your full name.";
    if (!/^[0-9]{10}$/.test(formData.mobile_number)) e.mobile_number = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter a valid email address.";
    if (!formData.program) e.program = "Please select a program.";
    if (!formData.consent) e.consent = "Please accept to continue.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    const { consent, ...withOutConsent } = formData;
    try {
      const response = await fetch(`${BASE_URL}/apply-now-forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: withOutConsent }),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      setMessage({
        text: "Thank you! Your admission request has been submitted. Our counselors will reach out shortly.",
        type: "success",
      });
      setFormData({ full_name: "", mobile_number: "", email: "", program: "", consent: false });
      setErrors({});
    } catch (error) {
      setMessage({ text: "We couldn't submit your request right now. Please try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="apn-form" onSubmit={handleSubmit} noValidate>
      <span className="apn-form__badge">
        <BadgeCheck size={13} /> Admissions Open 2025-26
      </span>
      <h2 className="apn-form__heading">Quick Inquiry Form</h2>
      <p className="apn-form__subtitle">
        Submit your query below and our academic advisor will assist you with counseling, courses,
        and reservations.
      </p>

      <div className="apn-form__grid">
        <div className="apn-form__field">
          <label className="apn-form__label" htmlFor="apn-name">
            Full Name <span>*</span>
          </label>
          <div className="apn-form__control">
            <span className="apn-form__icon">
              <User size={16} />
            </span>
            <input
              id="apn-name"
              className={`apn-form__input${errors.full_name ? " has-error" : ""}`}
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={(e) => setField("full_name", e.target.value)}
            />
          </div>
          {errors.full_name && <span className="apn-form__error">{errors.full_name}</span>}
        </div>

        <div className="apn-form__field">
          <label className="apn-form__label" htmlFor="apn-mobile">
            Mobile Number <span>*</span>
          </label>
          <div className="apn-form__control">
            <span className="apn-form__icon">
              <Phone size={16} />
            </span>
            <input
              id="apn-mobile"
              className={`apn-form__input${errors.mobile_number ? " has-error" : ""}`}
              type="tel"
              name="mobile_number"
              placeholder="Enter your 10-digit number"
              inputMode="numeric"
              maxLength={10}
              value={formData.mobile_number}
              onChange={(e) => setField("mobile_number", e.target.value.replace(/\D/g, ""))}
            />
          </div>
          {errors.mobile_number && <span className="apn-form__error">{errors.mobile_number}</span>}
        </div>

        <div className="apn-form__field">
          <label className="apn-form__label" htmlFor="apn-email">
            Email Address <span>*</span>
          </label>
          <div className="apn-form__control">
            <span className="apn-form__icon">
              <Mail size={16} />
            </span>
            <input
              id="apn-email"
              className={`apn-form__input${errors.email ? " has-error" : ""}`}
              type="email"
              name="email"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>
          {errors.email && <span className="apn-form__error">{errors.email}</span>}
        </div>

        <div className="apn-form__field">
          <label className="apn-form__label" htmlFor="apn-program">
            Program of Choice <span>*</span>
          </label>
          <div className="apn-form__control">
            <span className="apn-form__icon">
              <GraduationCap size={16} />
            </span>
            <select
              id="apn-program"
              className={`apn-form__input${errors.program ? " has-error" : ""}`}
              name="program"
              value={formData.program}
              onChange={(e) => setField("program", e.target.value)}
            >
              <option value="" disabled>
                Select your desired program
              </option>
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          {errors.program && <span className="apn-form__error">{errors.program}</span>}
        </div>

        <div className="apn-form__field">
          <label className="apn-form__consent">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setField("consent", e.target.checked)}
            />
            <span>
              I authorize Nagarjuna College of Management Studies to contact me via Call, WhatsApp,
              SMS, or Email regarding admissions and news. This consent overrides any registration
              on DND registries. <span style={{ color: "#f6872a" }}>*</span>
            </span>
          </label>
          {errors.consent && <span className="apn-form__error">{errors.consent}</span>}
        </div>
      </div>

      <button className="apn-form__submit" type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="apn-spinner" aria-hidden="true" /> Submitting…
          </>
        ) : (
          <>
            Register Request <Send size={16} />
          </>
        )}
      </button>

      {message && (
        <p role="status" className={`apn-form__status ${message.type === "success" ? "is-success" : "is-error"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
};

export default QueryForm;
