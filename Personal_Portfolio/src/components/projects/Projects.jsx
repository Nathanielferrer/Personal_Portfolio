import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { PROJECTS_DATA } from '../../data/projectsData';
import { CERTIFICATIONS_DATA } from '../../data/certificationsData';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import CertificateCard from './CertificateCard';
import CertificateModal from './CertificateModal';
import MaskedHeading from '../reactbits/MaskedHeading';
import AnimatedContent from '../reactbits/AnimatedContent';
import backgroundVideo from '../../assets/Images/Background.mp4';
import './Projects.css';

export default function Projects() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'certifications'

  // Project details modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialVideoMode, setInitialVideoMode] = useState(false);

  // Certificate details modal state
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const handleOpenDetails = (project) => {
    setSelectedProject(project);
    setInitialVideoMode(false);
    setIsModalOpen(true);
  };

  const handlePlayVideo = (project) => {
    setSelectedProject(project);
    setInitialVideoMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenCertificate = (cert) => {
    setSelectedCertificate(cert);
    setIsCertModalOpen(true);
  };

  const handleCloseCertModal = () => {
    setIsCertModalOpen(false);
  };

  return (
    <section className="projects-section" id="projects">
      {/* Section Header (Fixed static height to prevent layout shift between tabs) */}
      <AnimatedContent distance={40} direction="vertical" duration={0.8} ease="power3.out" threshold={0.15}>
        <div className="projects-header">
          <span className="projects-eyebrow">PORTFOLIO SHOWCASE</span>
          <h2 className="projects-title">Featured Showcase</h2>
          <p className="projects-subtitle">
            Explore my featured development projects and verified industry certifications.
          </p>

          {/* 2 Category Tabs (Positioned at upper left) */}
          <div className="projects-tabs">
            <button
              type="button"
              className={`projects-tab-btn ${activeTab === 'projects' ? 'projects-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Projects</span>
              <span className="projects-tab-badge">{PROJECTS_DATA.length}</span>
            </button>

            <button
              type="button"
              className={`projects-tab-btn ${activeTab === 'certifications' ? 'projects-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('certifications')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5l4 -2l4 2l-2 -5" />
                <circle cx="12" cy="9" r="6" />
              </svg>
              <span>Certifications</span>
              <span className="projects-tab-badge">{CERTIFICATIONS_DATA.length}</span>
            </button>
          </div>
        </div>
      </AnimatedContent>

      {/* 2-Column Responsive Grid for Projects */}
      {activeTab === 'projects' && (
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          stagger={0.08}
          ease="power3.out"
          threshold={0.1}
          className="projects-grid"
        >
          {PROJECTS_DATA.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleOpenDetails}
              onPlayVideo={handlePlayVideo}
            />
          ))}
        </AnimatedContent>
      )}

      {/* 2-Column Responsive Grid for Certifications */}
      {activeTab === 'certifications' && (
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          stagger={0.08}
          ease="power3.out"
          threshold={0.1}
          className="projects-grid"
        >
          {CERTIFICATIONS_DATA.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onViewDetails={handleOpenCertificate}
            />
          ))}
        </AnimatedContent>
      )}

      {/* Masked Heading Banner (Interactive Video Text Mask) */}
      <div className="projects-masked-heading-container">
        <MaskedHeading
          text="Crafting Modern Web Experiences"
          mediaType="video"
          src={backgroundVideo}
          fillScale={1.3}
          parallax={24}
          reveal="scale"
          trigger="view"
          spotlight={false}
          outline={true}
          outlineColor={darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.25)'}
          outlineWidth={darkMode ? 1.5 : 1}
          brightness={darkMode ? 1.6 : 1.05}
          saturation={darkMode ? 1.35 : 1.1}
          tint=""
          duration={1.2}
          stagger={0.08}
          drift={16}
          align="center"
          weight={800}
          textScale={0.11}
          lineHeight={1.1}
          className="projects-masked-heading"
        />
      </div>

      {/* Web Project Details / Video Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialVideoMode={initialVideoMode}
      />

      {/* Certificate Details Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isCertModalOpen}
        onClose={handleCloseCertModal}
      />
    </section>
  );
}
