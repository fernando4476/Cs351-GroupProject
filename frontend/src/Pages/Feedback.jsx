import React from "react";
import "./Feedback.css";

const Feedback = () => {
  return (
    <div className="feedback-wrapper">
      <h1 className="feedback-title">Feedback & Support</h1>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>How do I become a service provider?</h3>
          <p>
            Go to the “Become a Provider” page in the navigation bar and fill out 
            your provider application. You must use a UIC email.
          </p>
        </div>

        <div className="faq-item">
          <h3>How do I contact support?</h3>
          <p>
            You can email our support team at <strong>support@uicconnect.com</strong>.
          </p>
        </div>

        <div className="faq-item">
          <h3>How do I report a provider?</h3>
          <p>
            Go to the provider’s profile and click “Report Provider.” Our team 
            reviews all reports within 24 hours.
          </p>
        </div>

        <div className="faq-item">
          <h3>Why do I need a @uic.edu email?</h3>
          <p>
            UIC Connect is an internal marketplace exclusively for UIC students 
            and staff to ensure safety and trust.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-section">
        <h2>Send Feedback</h2>

        <form className="contact-form">
          <input type="text" placeholder="Full name" required />
          <input type="email" placeholder="UIC Email" required />
          <textarea placeholder="Your message..." rows="5" required></textarea>
          <button className="submit-btn" type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
