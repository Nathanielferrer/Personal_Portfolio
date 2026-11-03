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

export default function ProjectCard({ project, onViewDetails, onPlayVideo }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0, primed: false };
    let raf = 0;
    let last = 0;

    // Precompute radial gradient stops and spotlight radius
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
    <article ref={cardRef} className="project-card">
      {/* Chroma Grid Spotlight Radial Background Wash */}
      <span className="chroma-wash" aria-hidden="true" />

      {/* Media Preview Container (Black & White base with Chroma Spotlight Color reveal) */}
      <div className="project-card-media" onClick={() => onViewDetails(project)}>
        {/* 1. Base Layer: Black and White (Grayscale) */}
        <img
          src={project.previewImage}
          alt={project.title}
          className="project-card-img project-card-img--mono"
          loading="lazy"
        />

        {/* 2. Top Layer: Vibrant Color (Revealed under Chroma Spotlight) */}
        <img
          src={project.previewImage}
          alt=""
          aria-hidden="true"
          className="project-card-img project-card-img--color"
          loading="lazy"
        />

        {/* Role & Status Badges */}
        {(project.role || project.status) && (
          <div className="project-card-badges">
            {project.role && <span className="project-role-badge">{project.role}</span>}
            {project.status && <span className="project-status-badge">{project.status}</span>}
          </div>
        )}

        {/* Hover Action Pill Overlay */}
        <div className="project-card-hover-hint">
          <span>Click to view details</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Inner rim for clean crisp boundary */}
        <span className="chroma-media-rim" aria-hidden="true" />
      </div>

      {/* Card Content - Title only (short description removed) */}
      <div className="project-card-body">
        <h3 className="project-card-title" onClick={() => onViewDetails(project)}>
          {project.title}
        </h3>

        {/* Card Footer with Buttons on Left and Date Created on Right */}
        <div className="project-card-footer">
          <div className="project-card-actions">
            {/* 1. View Details */}
            <button
              type="button"
              className="project-btn project-btn--details"
              onClick={() => onViewDetails(project)}
              title="View full project details"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>View Details</span>
            </button>

            {/* 2. Video Demo (Rendered only if available) */}
            {project.hasVideoDemo && (
              <button
                type="button"
                className="project-btn project-btn--video"
                onClick={() => onPlayVideo(project)}
                title="Watch demonstration video"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Video Demo</span>
              </button>
            )}

            {/* 3. Source Code */}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn--source"
              title="View source code on GitHub"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Source Code</span>
            </a>
          </div>

          {/* Date Created (Year) at bottom right */}
          {project.year && (
            <div className="project-card-date" title={`Created: ${project.year}`}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{project.year}</span>
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
