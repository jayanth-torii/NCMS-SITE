"use client";

import React from "react";

const ContactDetails = () => {
  return (
    <div className="min-h-screen text-black mx-auto flex flex-col md:flex-row gap-6 bg-[#F6F6F6] mb-20">
      {/* Left Image Section */}
      <div className="w-full md:w-[30%] flex justify-center items-center">
        <img
          src="images/contact-us-page/contact-details-image.png"
          alt="Programme"
          className="w-full h-full object-cover shadow-lg"
        />
      </div>

      {/* Right Container */}
      <div className="w-full md:w-[70%] bg-[#F6F6F6] p-6 flex flex-col justify-center">
        {/* Section 1: Get In Touch */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#003333]">Get In Touch</h2>
          <p className="text-[#003333] mt-2 text-xl">
            Thank you for visiting our website. If you have feedback, we are eager to hear from you. <br />
            <strong>Call Us for General Queries:</strong> +91- 8067462700 <br />
            <strong>Call Us for Admissions Queries:</strong> +91- 8722992333, +91-9731407062 <br />
            <strong>For Admission-related queries, write to:</strong> info@ncetmail.com
          </p>
        </div>

        {/* Section 2: Address */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#003333]">Address</h2>
          <p className="text-[#003333] mt-2 text-xl">
            Nagarjuna College of Engineering & Technology <br />
            Beedaganahalli, Venkatagiri Kote, Post, <br />
            Devanahalli, Bengaluru, Karnataka 562110
          </p>
        </div>

        {/* Section 3: Contact Us */}
        <div>
          <h2 className="text-2xl font-bold text-[#003333]">Contact Us</h2>
          <p className="text-[#003333] mt-2 text-xl">
            If you have any questions or feedback about Nagarjuna Institute Of Technology, please do not hesitate to get in touch with us. <br />
            You can reach us by phone, email, or by visiting our campus. <br />
            The contact number and email address for the university can be easily found on our website, along with the university address. <br />
            Moreover, specific contact numbers and emails for different schools and programmes within the university are also available on our website. <br />
            We are eager to hear from you and are here to assist in any way we can.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
