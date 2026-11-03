import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const falloffStops = (softness = 0.6) => {
  const core = clamp(1 - softness, 0, 0.95);
  const stops = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const u = clamp((t - core) / Math.max(0.0001, 1 - core), 0, 1);
    const alpha = 1 - u * u * u * (u * (u * 6 - 15) + 10);
    stops.push(`rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`);
  }
  return stops.join(', ');
};

export default function CertificateCard({ certificate, onViewDetails }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0, primed: false };
    let raf = 0;
    let last = 0;

    // Set static falloff stops and radius for spotlight
    card.style.setProperty('--chroma-stops', falloffStops(0.6));
    card.style.setProperty('--chroma-r', '280px');

    const frameLoop = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const follow = reduce ? 1 : 1 - Math.exp(-dt / 0.14);
      state.x += (state.tx - state.x) * follow;
      state.y += (state.ty - state.y) * follow;
      const span = state.target > state.power ? 0.1 : 0.22;
      state.power += (state.target - state.power) * (reduce ? 1 : 1 - Math.exp(-dt / span));

      card.style.setProperty('--chroma-x', `${state.x.toFixed(2)}px`);
      card.style.setProperty('--chroma-y', `${state.y.toFixed(2)}px`);
      card.style.setProperty('--chroma-power', state.power.toFixed(4));

      const settled =
        Math.abs(state.tx - state.x) < 0.1 &&
        Math.abs(state.ty - state.y) < 0.1 &&
        Math.abs(state.target - state.power) < 0.002;
      if (settled) {
        state.power = state.target;
        card.style.setProperty('--chroma-power', state.power.toFixed(4));
        last = 0;
      } else {
        raf = requestAnimationFrame(frameLoop);
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frameLoop);
    };

    const onMove = (e) => {
      const box = card.getBoundingClientRect();
      state.tx = e.clientX - box.left;
      state.ty = e.clientY - box.top;
      if (!state.primed || state.power < 0.02) {
        state.x = state.tx;
        state.y = state.ty;
        state.primed = true;
      }
      state.target = 1;
      wake();
    };

    const onLeave = () => {
      state.target = 0;
      wake();
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerdown', onMove);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('pointercancel', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerdown', onMove);
      card.removeEventListener('pointerleave', onLeave);
      card.removeEventListener('pointercancel', onLeave);
    };
  }, []);

  return (
    <article ref={cardRef} className="project-card certificate-card">
      {/* Chroma Grid Spotlight Radial Background Wash */}
      <span className="chroma-wash" aria-hidden="true" />

      {/* Certificate Preview Container (Black & White base with Chroma Spotlight Color reveal) */}
      <div className="project-card-media" onClick={() => onViewDetails(certificate)}>
        {/* 1. Base Layer: Black and White (Grayscale) */}
        <img
          src={certificate.previewImage}
          alt={certificate.title}
          className="project-card-img project-card-img--mono"
          loading="lazy"
        />

        {/* 2. Top Layer: Vibrant Color (Revealed under Chroma Spotlight) */}
        <img
          src={certificate.previewImage}
          alt=""
          aria-hidden="true"
          className="project-card-img project-card-img--color"
          loading="lazy"
        />

        {/* Issuer & Status Badges */}
        <div className="project-card-badges">
          <span className="project-role-badge">{certificate.issuer}</span>
          {certificate.status && <span className="project-status-badge">{certificate.status}</span>}
        </div>

        {/* Hover Action Pill Overlay */}
        <div className="project-card-hover-hint">
          <span>Click to view certificate</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Inner rim for clean crisp boundary */}
        <span className="chroma-media-rim" aria-hidden="true" />
      </div>

      {/* Card Content - Title only */}
      <div className="project-card-body">
        <h3 className="project-card-title" onClick={() => onViewDetails(certificate)}>
          {certificate.title}
        </h3>

        {/* Card Footer with Buttons on Left and Date Studied on Right */}
        <div className="project-card-footer">
          <div className="project-card-actions">
            {/* 1. View Details */}
            <button
              type="button"
              className="project-btn project-btn--details"
              onClick={() => onViewDetails(certificate)}
              title="View full certificate details & skills"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>View Details</span>
            </button>

            {/* 2. View / Download PDF */}
            {certificate.pdfUrl && (
              <a
                href={certificate.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-btn project-btn--source"
                title="Open official PDF certificate"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>View PDF</span>
              </a>
            )}
          </div>

          {/* Date Studied (Year) at bottom right - same as ProjectCard */}
          {certificate.year && (
            <div className="project-card-date" title={`Studied: ${certificate.year}`}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{certificate.year}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chroma Grid Spotlight Glowing Border and Outer Rim */}
      <span className="chroma-card-rim" aria-hidden="true" />
      <span className="chroma-card-glow" aria-hidden="true" />
    </article>
  );
}

