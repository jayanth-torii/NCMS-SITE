"use client";

import { useState } from "react";
import { BASE_URL } from "@/config/apiService";

const fieldBase =
  "w-full h-[50px] rounded-[10px] border-[1.5px] border-[#e3e8f0] bg-[#f8fafc] px-4 text-[15px] text-[#1b2440] transition-all duration-200 placeholder:text-[#9aa3b5] focus:border-blue-accent focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-blue-accent/15";

const invalidField =
  "border-[#f0a8a0] bg-[#fef4f3] focus:border-[#d92d20] focus:ring-[#d92d20]/15";

const labelClass =
  "mb-2 block text-[13.5px] font-bold tracking-[0.3px] text-navy";

const QueryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    subjectOfInterest: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isCheckbox = e.target instanceof HTMLInputElement && e.target.type === "checkbox";
    const next: Record<string, string | boolean> = { ...formData };
    next[name] = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData(next as typeof formData);
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "mobileNumber") {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: value && !/^[0-9]{10}$/.test(value) ? "Enter a valid 10-digit number" : "",
      }));
    }
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email address" : "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errs: Record<string, string> = {};
    if (formData.name.trim().length < 3) errs.name = "Please enter your full name.";
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) errs.mobileNumber = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address.";
    if (formData.message.trim().length < 5) errs.message = "Please describe your query (min 5 characters).";
    if (!formData.consent) errs.consent = "Please accept the consent to continue.";

    if (Object.keys(errs).length) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    try {
      const { consent, ...formDataToSend } = formData;

      const response = await fetch(`${BASE_URL}/contact-us-forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formDataToSend }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      showMessage("Thanks for reaching out! We've received your query and will respond soon.", "success");

      setFormData({
        name: "",
        mobileNumber: "",
        email: "",
        subjectOfInterest: "",
        message: "",
        consent: false,
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      showMessage("We couldn't submit your query right now. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="con-card rounded-[20px] border border-[#eef1f6] bg-white shadow-[0_20px_50px_rgba(15,18,22,0.08)]">
      <div className="px-6 pb-1 pt-8 md:px-9">
        <h2 className="mb-2 text-[26px] font-extrabold tracking-[-0.4px] text-navy">
          Submit Your <span className="text-orange">Query</span>
        </h2>
        <p className="text-[15.5px] leading-[1.6] text-body-gray">
          Send us a message and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="px-6 pb-8 pt-6 md:px-9 md:pb-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-[22px] gap-y-5 md:grid-cols-2">
            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="qf-name" className={labelClass}>
                Full Name <span className="text-orange">*</span>
              </label>
              <input
                id="qf-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`${fieldBase} ${errors.name ? invalidField : ""}`}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className="mt-1.5 text-[12.5px] font-semibold text-[#d92d20]">{errors.name}</span>}
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col">
              <label htmlFor="qf-mobile" className={labelClass}>
                Mobile Number <span className="text-orange">*</span>
              </label>
              <input
                id="qf-mobile"
                type="tel"
                name="mobileNumber"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="9876543210"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`${fieldBase} ${errors.mobileNumber ? invalidField : ""}`}
                aria-invalid={!!errors.mobileNumber}
              />
              {errors.mobileNumber && (
                <span className="mt-1.5 text-[12.5px] font-semibold text-[#d92d20]">{errors.mobileNumber}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="qf-email" className={labelClass}>
                Email ID <span className="text-orange">*</span>
              </label>
              <input
                id="qf-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`${fieldBase} ${errors.email ? invalidField : ""}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="mt-1.5 text-[12.5px] font-semibold text-[#d92d20]">{errors.email}</span>}
            </div>

            {/* Subject Of Interest */}
            <div className="flex flex-col">
              <label htmlFor="qf-subject" className={labelClass}>
                Subject Of Interest
              </label>
              <input
                id="qf-subject"
                type="text"
                name="subjectOfInterest"
                placeholder="e.g. Admissions, Scholarships"
                value={formData.subjectOfInterest}
                onChange={handleChange}
                className={fieldBase}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="qf-desc" className={labelClass}>
                Short Description of Related Query <span className="text-orange">*</span>
              </label>
              <textarea
                id="qf-desc"
                name="message"
                rows={4}
                placeholder="Tell us more about your query…"
                value={formData.message}
                onChange={handleChange}
                className={`${fieldBase} h-auto min-h-[132px] resize-y py-3.5 leading-[1.55] ${errors.message ? invalidField : ""}`}
                aria-invalid={!!errors.message}
              />
              {errors.message && <span className="mt-1.5 text-[12.5px] font-semibold text-[#d92d20]">{errors.message}</span>}
            </div>
          </div>

          {/* Consent */}
          <div className="mt-5 flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-body-gray">
            <input
              id="qf-consent"
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5 h-[18px] w-[18px] flex-none cursor-pointer accent-orange"
            />
            <label htmlFor="qf-consent" className="cursor-pointer">
              I Authorise Nagarjuna College of Management Studies and its representatives to contact me with updates
              and notifications by email, SMS, WhatsApp, and call. This will override the registry on DND/NDNC
              <span className="text-orange">*</span>
            </label>
          </div>
          {errors.consent && (
            <span className="mt-1.5 block text-[12.5px] font-semibold text-[#d92d20]">{errors.consent}</span>
          )}

          {/* Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[190px] cursor-pointer items-center justify-center gap-2 rounded-full bg-orange px-8 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-cta)] transition-all duration-200 hover:bg-orange-dark hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading && <span className="con-spinner h-4 w-4 animate-spin rounded-full border-2 border-white/45 border-t-white" />}
              {loading ? "Sending…" : "Submit Query"}
            </button>
          </div>

          {/* Status */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-[10px] border px-4 py-3 text-[14px] font-semibold ${
                message.type === "success"
                  ? "border-[#bfe6ce] bg-[#eaf7ef] text-[#1b7f47]"
                  : "border-[#f3c9c4] bg-[#fef4f3] text-[#b42318]"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default QueryForm;
