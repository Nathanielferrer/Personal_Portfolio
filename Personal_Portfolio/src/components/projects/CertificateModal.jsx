import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CertificateModal({
  certificate,
  isOpen,
  onClose
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleAnimatedClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  }, [onClose]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleAnimatedClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleAnimatedClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;
  if (!certificate) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`project-modal-backdrop ${isClosing ? 'project-modal--closing' : 'project-modal--open'}`}
      onClick={handleAnimatedClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-certificate-title"
    >
      <div
        className="project-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="project-modal-close"
          onClick={handleAnimatedClose}
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="project-modal-grid">
          {/* ================= LEFT SIDE: Certificate Preview ================= */}
          <div className="project-modal-left">
            {/* Preview Frame: Occupies full available space with 100% visible certificate */}
            <div className="project-modal-preview-box">
              <div className="project-modal-image-wrap">
                <img
                  src={certificate.previewImage}
                  alt={certificate.title}
                  className="project-modal-image"
                />
              </div>
            </div>

            {/* Left Column Action Buttons */}
            <div className="project-modal-links">
              {/* 1. View Official PDF */}
              {certificate.pdfUrl && (
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-btn project-modal-btn--video-action"
                  title="Open official PDF certificate in a new tab"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>Open PDF Certificate</span>
                </a>
              )}

              {/* 2. Open Full Image */}
              <a
                href={certificate.previewImage}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-btn project-modal-btn--github"
                title="View high-resolution certificate image"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
                <span>Full Resolution</span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT SIDE: Certificate Information ================= */}
          <div className="project-modal-right">
            {/* Header info (Issuer, Role & Status Badges) */}
            <div className="project-modal-header">
              <div className="project-modal-tags">
                <span className="project-role-badge">{certificate.issuer}</span>
                <span className="project-status-badge">{certificate.status}</span>
              </div>
              <h2 id="modal-certificate-title" className="project-modal-title">
                {certificate.title}
              </h2>
            </div>

            {/* Scrollable text container */}
            <div className="project-modal-content-scroll">
              {/* Section 1: Course Overview */}
              <div className="project-modal-section">
                <h4 className="project-modal-section-title">
                  <span>Course Overview</span>
                </h4>
                <p className="project-modal-about-text">{certificate.about}</p>
              </div>

              {/* Section 2: Knowledge & Skills Gained */}
              {certificate.knowledgeGained && certificate.knowledgeGained.length > 0 && (
                <div className="project-modal-section">
                  <h4 className="project-modal-section-title">
                    <span>Knowledge & Skills Gained</span>
                  </h4>
                  <ul className="certificate-knowledge-list">
                    {certificate.knowledgeGained.map((point, index) => (
                      <li key={index} className="certificate-knowledge-item">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Section 3: Credential Verification Details */}
              <div className="project-modal-section certificate-cred-box">
                <h4 className="project-modal-section-title">
                  <span>Credential Verification</span>
                </h4>
                <div className="certificate-meta-grid">
                  <div className="certificate-meta-item">
                    <span className="certificate-meta-label">Issued To:</span>
                    <span className="certificate-meta-value">{certificate.recipient}</span>
                  </div>
                  <div className="certificate-meta-item">
                    <span className="certificate-meta-label">Completion Date:</span>
                    <span className="certificate-meta-value">{certificate.issueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

