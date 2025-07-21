import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-details">
        <div className="contact-item">
          <h2>📍 Address</h2>
          <p>LocalBazaar Office</p>
          <p>123 Market Street,</p>
          <p>Gomti Nagar, Lucknow, UP - 226010</p>
        </div>

        <div className="contact-item">
          <h2>📞 Phone</h2>
          <p>+91 98765 43210</p>
          <p>+91 87654 32109</p>
        </div>

        <div className="contact-item">
          <h2>✉️ Email</h2>
          <p>support@localbazaar.in</p>
          <p>info@localbazaar.in</p>
        </div>

        <div className="contact-item">
          <h2>🕐 Office Hours</h2>
          <p>Monday to Saturday: 9:00 AM - 6:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
