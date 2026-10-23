import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { AiOutlineSend, AiOutlineMail, AiOutlinePhone, AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";


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
    canMailto: false,
  });

  const [copiedEmail, setCopiedEmail] = useState(false);

  const directEmail = "rishitharayapati40@gmail.com";
  const directPhone = "+91 9121624512";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(
      formData.subject.trim() || "Portfolio Inquiry - Rishitha Rayapati"
    );
    const bodyText = `Hi Rishitha,\n\n${formData.message.trim() || "[Type your message here]"}\n\nBest regards,\n${formData.name.trim() || "[Your Name]"}\nEmail: ${formData.email.trim() || "[Your Email]"}`;
    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:${directEmail}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const { name, email, subject, message, _gotcha } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatus({
        submitting: false,
        success: false,
        canMailto: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus({
        submitting: false,
        success: false,
        canMailto: false,
        message: "Please enter a valid email address.",
      });
      return;
    }

    setStatus({
      submitting: true,
      success: null,
      message: "",
      canMailto: false,
    });

    let sentSuccessfully = false;
    let successMessage = "";

    // Tier 1: Try custom backend or Vercel API if available
    const apiBaseUrl = process.env.REACT_APP_API_URL || "";
    try {
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/contact` : "/api/contact";
      const backendRes = await axios.post(
        endpoint,
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          _gotcha,
        },
        { timeout: 4000 }
      );

      if (backendRes.data && backendRes.data.success) {
        sentSuccessfully = true;
        successMessage =
          backendRes.data.message ||
          "Thank you! Your message has been sent successfully. I will get back to you soon.";
      }
    } catch (backendErr) {
      // If relative URL fails and in dev without proxy, try direct port 5000
      if (!apiBaseUrl && (backendErr.response?.status === 404 || backendErr.code === "ERR_NETWORK")) {
        try {
          const directRes = await axios.post(
            "http://localhost:5000/api/contact",
            {
              name: name.trim(),
              email: email.trim(),
              subject: subject.trim(),
              message: message.trim(),
              _gotcha,
            },
            { timeout: 3000 }
          );

          if (directRes.data && directRes.data.success) {
            sentSuccessfully = true;
            successMessage =
              directRes.data.message ||
              "Thank you! Your message has been sent successfully. I will get back to you soon.";
          }
        } catch (p5000Err) {
          // Continue to Tier 2 fallback
        }
      }
    }

    // Tier 2: Resilient FormSubmit.co serverless delivery (works on web without local backend)
    if (!sentSuccessfully) {
      try {
        const formSubmitRes = await axios.post(
          `https://formsubmit.co/ajax/${directEmail}`,
          {
            name: name.trim(),
            email: email.trim(),
            _replyto: email.trim(),
            _subject: `[Portfolio Message] ${subject.trim()}`,
            message: message.trim(),
            _template: "table",
            _captcha: "false",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 10000,
          }
        );

        if (
          formSubmitRes.data &&
          (formSubmitRes.data.success === "true" ||
            formSubmitRes.data.success === true ||
            formSubmitRes.status === 200)
        ) {
          sentSuccessfully = true;
          successMessage =
            "Thank you! Your message has been sent successfully to Rishitha. I will get back to you soon!";
        }
      } catch (fsErr) {
        console.warn("FormSubmit attempt error:", fsErr);
      }
    }

    if (sentSuccessfully) {
      setStatus({
        submitting: false,
        success: true,
        canMailto: false,
        message: successMessage,
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
      // Tier 3: Suggest direct mail client action with pre-populated message
      setStatus({
        submitting: false,
        success: false,
        canMailto: true,
        message:
          "Unable to send automatically via web right now. Please click below to send directly using your Email App or email rishitharayapati40@gmail.com directly.",
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
                <div>{status.message}</div>
                {status.canMailto && (
                  <div style={{ marginTop: "12px" }}>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={handleOpenMailto}
                      style={{
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <AiOutlineMail /> Open in Email App
                    </Button>
                  </div>
                )}
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

              <div className="text-center d-flex flex-wrap justify-content-center gap-3">
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

                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={handleOpenMailto}
                  className="contact-mailto-btn"
                  style={{
                    borderRadius: "8px",
                    padding: "11px 22px",
                    fontWeight: "500",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    borderColor: "rgba(199, 112, 240, 0.45)",
                    color: "#e9d5ff",
                  }}
                  title="Open message directly in your default mail app"
                >
                  <AiOutlineMail style={{ fontSize: "1.1em" }} />
                  Send via Mail App
                </Button>
              </div>
            </Form>

            {/* Quick Direct Contact Info */}
            <div
              style={{
                marginTop: "35px",
                paddingTop: "25px",
                borderTop: "1px solid rgba(199, 112, 240, 0.2)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                  marginBottom: "12px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Or reach out directly via:
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(98, 54, 134, 0.2)",
                    border: "1px solid rgba(199, 112, 240, 0.3)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.88rem",
                    color: "#e9d5ff",
                  }}
                >
                  <AiOutlineMail style={{ color: "#c770f0" }} />
                  <a
                    href={`mailto:${directEmail}`}
                    style={{ color: "#ffffff", textDecoration: "none" }}
                  >
                    {directEmail}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      color: copiedEmail ? "#10b981" : "#c770f0",
                      cursor: "pointer",
                      padding: "0 2px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Copy Email"
                  >
                    {copiedEmail ? <AiOutlineCheck /> : <AiOutlineCopy />}
                  </button>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(98, 54, 134, 0.2)",
                    border: "1px solid rgba(199, 112, 240, 0.3)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.88rem",
                    color: "#e9d5ff",
                  }}
                >
                  <AiOutlinePhone style={{ color: "#c770f0" }} />
                  <a
                    href={`tel:${directPhone.replace(/\s+/g, "")}`}
                    style={{ color: "#ffffff", textDecoration: "none" }}
                  >
                    {directPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ContactForm;
