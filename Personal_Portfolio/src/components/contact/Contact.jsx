import { useEffect, useState } from 'react';
import AnimatedContent from '../reactbits/AnimatedContent';
import './Contact.css';

export default function Contact() {
  const [mountedAt] = useState(() => Date.now());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    message: ''
  });

  // Automatically dismiss the success notification after 5 seconds
  useEffect(() => {
    if (status.success) {
      const timer = setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: null, message: '' }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status.success]);

  const validateField = (fieldName, value) => {
    const trimmed = (value || '').trim();
    switch (fieldName) {
      case 'name': {
        if (!trimmed) return 'Please enter your name.';
        if (trimmed.length < 2 || trimmed.length > 60) return 'Name must be between 2 and 60 characters.';
        const nameValidChars = /^[a-zA-Z\s'.-]+$/;
        const hasLetters = /[a-zA-Z]/;
        if (!nameValidChars.test(trimmed) || !hasLetters.test(trimmed)) {
          return 'Please enter a valid name with letters (numbers only are not allowed).';
        }
        return '';
      }
      case 'email': {
        if (!trimmed) return 'Please enter your email address.';
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailRegex.test(trimmed) || trimmed.length > 100) {
          return 'Please enter a valid Gmail address ending in @gmail.com (e.g. name@gmail.com).';
        }
        return '';
      }
      case 'subject': {
        if (trimmed.length > 100) return 'Subject must not exceed 100 characters.';
        return '';
      }
      case 'message': {
        if (!trimmed) return 'Please enter your message.';
        if (trimmed.length < 10) return 'Message is too short (minimum 10 characters required).';
        if (trimmed.length > 3000) return 'Message exceeds the maximum limit of 3,000 characters.';
        return '';
      }
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time error dismissal: as user writes proper/right text, clear inline error
    if (fieldErrors[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const subjectErr = validateField('subject', formData.subject);
    const messageErr = validateField('message', formData.message);

    if (nameErr || emailErr || subjectErr || messageErr) {
      setFieldErrors({
        name: nameErr,
        email: emailErr,
        subject: subjectErr,
        message: messageErr
      });
      return;
    }

    setFieldErrors({ name: '', email: '', subject: '', message: '' });

    // Honeypot check: silently succeed if hidden bot field is filled
    if (formData._gotcha) {
      setStatus({
        submitting: false,
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
      });
      setFormData({ name: '', email: '', subject: '', message: '', _gotcha: '' });
      return;
    }

    // Rate-limit check: 45-second cooldown per browser to prevent spam
    const lastSent = Number(localStorage.getItem('portfolio_last_contact_ts') || 0);
    const now = Date.now();
    if (now - lastSent < 45000) {
      const waitSec = Math.ceil((45000 - (now - lastSent)) / 1000);
      setStatus({
        submitting: false,
        success: false,
        message: `Please wait ${waitSec}s before sending another message.`
      });
      return;
    }

    setStatus({ submitting: true, success: null, message: '' });

    try {
      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.email.trim();
      const trimmedSubject = formData.subject.trim();
      const trimmedMessage = formData.message.trim();

      const web3FormsKey =
        import.meta.env.VITE_WEB3FORMS_KEY || '29518050-fce3-4cdf-8b0c-3da04509c3b9';

      let data = null;
      let lastErrorMessage = '';

      // 1. Primary: Web3Forms API (works reliably on Vercel & localhost)
      try {
        const web3Res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject
              ? `New Contact Message: ${trimmedSubject}`
              : 'New Portfolio Inquiry',
            from_name: `${trimmedName} (via Portfolio)`,
            replyto: trimmedEmail,
            message: trimmedMessage,
            botcheck: ''
          })
        });

        const web3Json = await web3Res.json();
        if (web3Json && web3Json.success) {
          data = {
            success: true,
            message: `Thank you, ${trimmedName}! Your message has been sent successfully.`
          };
        } else if (web3Json && web3Json.message) {
          lastErrorMessage = web3Json.message;
        }
      } catch (web3Err) {
        lastErrorMessage = web3Err.message;
      }

      // 2. Fallback: Serverless / local PHP endpoints if Web3Forms was unreachable
      if (!data) {
        const payload = {
          ...formData,
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
          _time: mountedAt
        };

        const endpoints = [
          '/api/contact',
          '/api/contact.php',
          'http://localhost/Portfolio/api/contact.php',
          '/Portfolio/api/contact.php'
        ];

        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            const rawText = await res.text();

            if (rawText.trim().startsWith('<?php')) {
              continue;
            }

            try {
              const parsed = JSON.parse(rawText);
              if (parsed && typeof parsed === 'object' && parsed.success) {
                data = parsed;
                break;
              } else if (parsed && parsed.message) {
                lastErrorMessage = parsed.message;
              }
            } catch {
              // ignore non-JSON fallback error
            }
          } catch (fetchErr) {
            lastErrorMessage = lastErrorMessage || fetchErr.message;
          }
        }
      }

      if (!data) {
        throw new Error(lastErrorMessage || 'Failed to send message. Please try again later.');
      }

      if (data.success) {
        localStorage.setItem('portfolio_last_contact_ts', String(Date.now()));
        setStatus({
          submitting: false,
          success: true,
          message: data.message || 'Thank you! Your message has been sent successfully.'
        });
        setFormData({ name: '', email: '', subject: '', message: '', _gotcha: '' });
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: data.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus({
        submitting: false,
        success: false,
        message: err.message || 'Failed to send message. Please check your connection and try again.'
      });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Left Column: Contact Information */}
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          ease="power3.out"
          threshold={0.15}
          className="contact-info-col"
        >
          <div className="contact-header">
            <span className="contact-eyebrow">GET IN TOUCH</span>
            <h2 className="contact-title">Let&apos;s work together</h2>
            <p className="contact-subtitle">
              I&apos;m always looking for exciting new projects and collaborations. Whether you
              need a high-performance web app, a clean UI/UX redesign, or want to discuss full-stack
              opportunities — feel free to reach out!
            </p>
          </div>

          <div className="contact-cards-group">
            {/* Email Card (Static display, non-clickable) */}
            <div className="contact-card contact-card--static">
              <div className="contact-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-card-content">
                <span className="contact-card-label">EMAIL</span>
                <span className="contact-card-value">nathanielferrer691@gmail.com</span>
              </div>
            </div>

            {/* Phone Card (Static display, non-clickable) */}
            <div className="contact-card contact-card--static">
              <div className="contact-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-card-content">
                <span className="contact-card-label">PHONE</span>
                <span className="contact-card-value">09153735618</span>
              </div>
            </div>
          </div>

          {/* Available for Work Card */}
          <div className="contact-status-card">
            <div className="contact-status-indicator">
              <span className="contact-status-dot">
                <span className="contact-status-ping" aria-hidden="true" />
              </span>
              <span className="contact-status-title">Available for work</span>
            </div>
            <p className="contact-status-desc">
              Open to freelance projects, internships, or full-time opportunities.
            </p>
          </div>
        </AnimatedContent>

        {/* Right Column: Interactive Contact Form */}
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          delay={0.15}
          ease="power3.out"
          threshold={0.15}
          className="contact-form-col"
        >
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* Honeypot Anti-Bot Field (Hidden from humans, traps automated spam bots) */}
            <div className="contact-honeypot" aria-hidden="true">
              <input
                type="text"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
                value={formData._gotcha}
                onChange={handleChange}
              />
            </div>

            {/* Field 1: Name */}
            <div className="contact-form-group">
              <label htmlFor="contact-name" className="contact-form-label">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className={`contact-form-input ${fieldErrors.name ? 'contact-form-input--error' : ''}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                maxLength={60}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                required
              />
              {fieldErrors.name && (
                <span id="contact-name-error" className="contact-field-error" role="alert">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{fieldErrors.name}</span>
                </span>
              )}
            </div>

            {/* Field 2: Email */}
            <div className="contact-form-group">
              <label htmlFor="contact-email" className="contact-form-label">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className={`contact-form-input ${fieldErrors.email ? 'contact-form-input--error' : ''}`}
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                required
              />
              {fieldErrors.email && (
                <span id="contact-email-error" className="contact-field-error" role="alert">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{fieldErrors.email}</span>
                </span>
              )}
            </div>

            {/* Field 3: Subject */}
            <div className="contact-form-group">
              <label htmlFor="contact-subject" className="contact-form-label">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                className={`contact-form-input ${fieldErrors.subject ? 'contact-form-input--error' : ''}`}
                placeholder="Project inquiry..."
                value={formData.subject}
                onChange={handleChange}
                maxLength={100}
                aria-invalid={Boolean(fieldErrors.subject)}
                aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
              />
              {fieldErrors.subject && (
                <span id="contact-subject-error" className="contact-field-error" role="alert">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{fieldErrors.subject}</span>
                </span>
              )}
            </div>

            {/* Field 4: Message */}
            <div className="contact-form-group">
              <label htmlFor="contact-message" className="contact-form-label">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                className={`contact-form-textarea ${fieldErrors.message ? 'contact-form-textarea--error' : ''}`}
                placeholder="Tell me about your project..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                minLength={10}
                maxLength={3000}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                required
              />
              {fieldErrors.message && (
                <span id="contact-message-error" className="contact-field-error" role="alert">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{fieldErrors.message}</span>
                </span>
              )}
            </div>

            {/* Status Feedback Banner with Auto-Dismiss and Manual Close */}
            {status.message && (
              <div
                className={`contact-form-feedback ${
                  status.success ? 'contact-form-feedback--success' : 'contact-form-feedback--error'
                }`}
                role="alert"
              >
                <div className="contact-feedback-content">
                  {status.success ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  <span>{status.message}</span>
                </div>
                <button
                  type="button"
                  className="contact-feedback-dismiss"
                  onClick={() => setStatus((prev) => ({ ...prev, success: null, message: '' }))}
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="contact-submit-btn"
              disabled={status.submitting}
              title="Submit message via PHPMailer"
            >
              {status.submitting ? (
                <>
                  <span className="contact-spinner" aria-hidden="true" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </AnimatedContent>
      </div>
    </section>
  );
}

