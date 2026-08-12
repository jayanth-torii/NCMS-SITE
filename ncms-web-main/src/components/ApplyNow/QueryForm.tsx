"use client";
import React, {useState, useEffect, Suspense} from "react";
import axios from "axios";
import { BASE_URL } from "@/config/apiService";

const QueryForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    program: "", // Added for the dropdown
    consent: false,
  });

  const [errors, setErrors] = useState({
    mobile_number: "",
    email: "",
    program: "", // Validation for dropdown
  });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "program" && value) {
      setErrors((prev) => ({ ...prev, program: "" })); // Clear error on selection
    }

    if (name === "mobileNumber" && !/^[0-9]{10}$/.test(value)) {
      setErrors((prev) => ({ ...prev, mobileNumber: "Enter a valid 10-digit number" }));
    } else if (name === "mobileNumber") {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }

    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      } else if (!value.endsWith(".com")) {
        setErrors((prev) => ({ ...prev, email: "Email must end with .com" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.program) {
      setErrors((prev) => ({ ...prev, program: "Please select a program" }));
      setLoading(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
      showMessage("Please enter a valid 10-digit mobile number.", "error");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showMessage("Please enter a valid email address.", "error");
      setLoading(false);
      return;
    }

    const { consent, ...withOutConsent } = formData;

    try {
      const response = await fetch( `${BASE_URL}/apply-now-forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: withOutConsent }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      showMessage("Form submitted successfully!", "success");

      setFormData({
        full_name: "",
        mobile_number: "",
        email: "",
        program: "",
        consent: false,
      });
      setErrors({ mobile_number: "", email: "", program: "" });
    } catch (error) {
      showMessage("An error occurred while submitting the form.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mb-20">
      {/* <h2 className="text-4xl font-bold text-[#101928] mb-10">SUBMIT YOUR QUERY HERE</h2> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#101928] font-medium text-xl">
            Enter Your Full Name <span className="text-[#C60084]">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full mt-1 mb-5 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div>
            <label className="block text-[#101928] font-medium text-xl">
              Enter Your Mobile Number <span className="text-[#C60084]">*</span>
            </label>
            <input
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
              className={`w-full mt-1 p-2 border mb-5 ${errors.mobile_number ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
              maxLength={10}
            />
            {errors.mobile_number && <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>}
          </div>

          <div>
            <label className="block text-[#101928] font-medium text-xl">
              Enter Your E-Mail ID <span className="text-[#C60084]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full mt-1 p-2 border mb-5 ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div> 
          <label className="block text-[#101928] font-medium text-xl">
            Programs Offered <span className="text-[#C60084]">*</span>
          </label>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            required
            className={`cursor-pointer w-full mt-1 p-3 border mb-5 ${errors.program ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
          >
            <option value="" disabled> Select a program</option>
            <option value="B.com">B.com</option>
            <option value="BBA">BBA</option>
            <option value="B.sc">B.sc</option>
            <option value="MBA">MBA</option>
          </select>
          {errors.program && <p className="text-red-500 text-sm mt-1">{errors.program}</p>}
        </div>

        <button
            type="submit"
            className="w-full cursor-pointer bg-[#0E2455] text-white py-5 rounded-md font-medium hover:bg-[#0C1E48] transition duration-300 text-xl flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              "Register Request"
            )}
        </button>

        {/* Success/Error message below the submit button */}
        {message && (
          <p className={`mt-4 text-center text-lg ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}

      </form>
    </div>

    );
};

export default QueryForm;
