import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    _gotcha: "", // Honeypot field for bot protection
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const { name, email, subject, message, _gotcha } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatus({
        submitting: false,
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus({
        submitting: false,
        success: false,
        message: "Please enter a valid email address.",
      });
      return;
    }

    setStatus({
      submitting: true,
      success: null,
      message: "",
    });

    try {
      // Determine API endpoint with fallback for local dev proxy
      const apiBaseUrl = process.env.REACT_APP_API_URL || "";
      let response;

      try {
        // Try relative URL first (leveraging CRA proxy or production domain)
        response = await axios.post(`${apiBaseUrl}/api/contact`, {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          _gotcha,
        });
      } catch (err) {
        // If relative URL fails (e.g. proxy not active in dev), try direct backend port 5000
        if (!apiBaseUrl && (err.response?.status === 404 || err.code === "ERR_NETWORK")) {
          response = await axios.post("http://localhost:5000/api/contact", {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            _gotcha,
          });
        } else {
          throw err;
        }
      }

      if (response.data && response.data.success) {
        setStatus({
          submitting: false,
          success: true,
          message:
            response.data.message ||
            "Thank you! Your message has been sent successfully. I will get back to you soon.",
        });
        // Clear form fields
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          _gotcha: "",
        });
      } else {
        setStatus({
          submitting: false,
          success: false,
          message:
            response.data?.message ||
            "Unable to send message. Please try again or reach out directly.",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to deliver message. Please ensure the backend server is running or email directly at rishitharayapati40@gmail.com.";
      setStatus({
        submitting: false,
        success: false,
        message: errorMessage,
      });
    }
  };

  return (
    <div className="contact-form-wrapper" style={{ marginTop: "40px" }}>
      <Row className="justify-content-center">
        <Col lg={8} md={10} xs={12}>
          <div className="contact-card">
            <h2 className="contact-title">
              Send Me a <span className="purple">Message</span>
            </h2>
            <p className="contact-subtitle">
              Have a question, opportunity, or just want to connect? Drop a message below!
            </p>

            {status.message && (
              <Alert
                variant={status.success ? "success" : "danger"}
                className={`contact-alert ${
                  status.success ? "contact-alert-success" : "contact-alert-danger"
                }`}
                dismissible
                onClose={() => setStatus((prev) => ({ ...prev, message: "" }))}
              >
                {status.message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="contact-form">
              {/* Honeypot field for bot spam prevention (invisible to humans) */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />

              <Row>
                <Col md={6} xs={12} className="mb-3">
                  <Form.Group controlId="contactName">
                    <Form.Label className="contact-label">Your Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-input"
                      required
                      disabled={status.submitting}
                      maxLength={100}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} xs={12} className="mb-3">
                  <Form.Group controlId="contactEmail">
                    <Form.Label className="contact-label">Your Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-input"
                      required
                      disabled={status.submitting}
                      maxLength={150}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="contactSubject" className="mb-3">
                <Form.Label className="contact-label">Subject *</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder="e.g. Collaboration Opportunity / Project Discussion"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-input"
                  required
                  disabled={status.submitting}
                  maxLength={200}
                />
              </Form.Group>

              <Form.Group controlId="contactMessage" className="mb-4">
                <Form.Label className="contact-label">Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="contact-input contact-textarea"
                  required
                  disabled={status.submitting}
                  maxLength={3000}
                />
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="contact-submit-btn"
                  disabled={status.submitting}
                >
                  {status.submitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "8px" }}
                      />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <AiOutlineSend style={{ marginRight: "8px", fontSize: "1.2em" }} />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ContactForm;
