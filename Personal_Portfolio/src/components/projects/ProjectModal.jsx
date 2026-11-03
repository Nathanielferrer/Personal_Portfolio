import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  initialVideoMode = false
}) {
  const [userMediaOverride, setUserMediaOverride] = useState(null);
  const mediaMode = userMediaOverride ?? (initialVideoMode ? 'video' : 'image');
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef(null);

  const handleAnimatedClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsExpanded(false);
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setUserMediaOverride(null);
      onClose();
    }, 280);
  }, [onClose]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          handleAnimatedClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExpanded, handleAnimatedClose]);

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

  // Ensure video is permanently muted whenever video mode is active
  useEffect(() => {
    if (mediaMode === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    } else if (mediaMode !== 'video' && videoRef.current) {
      videoRef.current.pause();
    }
  }, [mediaMode]);

  if (!isOpen && !isClosing) return null;
  if (!project) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`project-modal-backdrop ${isClosing ? 'project-modal--closing' : 'project-modal--open'}`}
      onClick={handleAnimatedClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
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
          {/* ================= LEFT SIDE: Project Preview ================= */}
          <div className="project-modal-left">
            {/* Preview Frame: Occupies full available space with 100% visible media */}
            <div className="project-modal-preview-box">
              {mediaMode === 'video' && project.hasVideoDemo ? (
                <div className="project-modal-video-wrap">
                  <video
                    ref={videoRef}
                    src={project.demoVideo}
                    controls
                    controlsList="nodownload novolume nofullscreen noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    muted
                    autoPlay
                    playsInline
                    className="project-modal-video"
                    onVolumeChange={(e) => {
                      e.target.muted = true;
                      e.target.volume = 0;
                    }}
                    onPlay={(e) => {
                      e.target.muted = true;
                      e.target.volume = 0;
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Corner Expand Button */}
                  <button
                    type="button"
                    className="project-modal-expand-btn"
                    onClick={() => setIsExpanded(true)}
                    title="Expand video to theater view"
                    aria-label="Expand video"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    <span>Expand</span>
                  </button>
                </div>
              ) : (
                <div className="project-modal-image-wrap">
                  <img
                    src={project.previewImage}
                    alt={project.title}
                    className="project-modal-image"
                  />
                </div>
              )}
            </div>

            {/* Left Column Action Buttons placed at the bottom */}
            <div className="project-modal-links">
              {/* Video Demo Toggle Button (Black & Gray palette, only if video exists) */}
              {project.hasVideoDemo && (
                <button
                  type="button"
                  className={`project-modal-btn project-modal-btn--video-action ${mediaMode === 'video' ? 'project-modal-btn--view-image' : ''}`}
                  onClick={() => setUserMediaOverride(mediaMode === 'video' ? 'image' : 'video')}
                  title={mediaMode === 'video' ? "Switch back to clean image" : "Play demonstration video"}
                >
                  {mediaMode === 'video' ? (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>View Image</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Video Demo</span>
                    </>
                  )}
                </button>
              )}

              {/* Source Code (GitHub) */}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-btn project-modal-btn--github"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Source Code</span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT SIDE: Project Information ================= */}
          <div className="project-modal-right">
            {/* Header info (Role & Status Badges) */}
            <div className="project-modal-header">
              {(project.role || project.status) && (
                <div className="project-modal-tags">
                  {project.role && <span className="project-role-badge">{project.role}</span>}
                  {project.status && <span className="project-status-badge">{project.status}</span>}
                </div>
              )}
              <h2 id="modal-project-title" className="project-modal-title">
                {project.title}
              </h2>
            </div>

            {/* Scrollable text container (Image on the left stays fixed) */}
            <div className="project-modal-content-scroll">
              {/* Section 1: About the Project */}
              <div className="project-modal-section">
                <h4 className="project-modal-section-title">
                  <span>About the Project</span>
                </h4>
                <p className="project-modal-about-text">{project.about}</p>
              </div>

              {/* Section 2: Core Technologies */}
              <div className="project-modal-section">
                <h4 className="project-modal-section-title">
                  <span>Core Technologies</span>
                </h4>

                <div className="project-modal-tech-groups">
                  {Object.entries(project.technologies).map(([category, stack]) => (
                    <div key={category} className="project-tech-group">
                      <span className="project-tech-group-label">{category}</span>
                      <div className="project-tech-badges">
                        {stack.map((tech) => (
                          <span key={tech} className="tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Centered Expand Theater for Demonstration Video */}
      {isExpanded && project.hasVideoDemo && (
        <div
          className="project-theater-overlay"
          onClick={() => setIsExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded video viewer"
        >
          <div
            className="project-theater-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="project-theater-bar">
              <div className="project-theater-info">
                <span className="project-theater-badge">Demonstration Video</span>
                <span className="project-theater-title">{project.title}</span>
              </div>
              <button
                type="button"
                className="project-theater-close"
                onClick={() => setIsExpanded(false)}
                title="Exit expanded view (Esc)"
                aria-label="Exit expanded view"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="project-theater-media">
              <video
                src={project.demoVideo}
                controls
                controlsList="nodownload novolume nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                autoPlay
                muted
                playsInline
                className="project-theater-video"
                onVolumeChange={(e) => {
                  e.target.muted = true;
                  e.target.volume = 0;
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
