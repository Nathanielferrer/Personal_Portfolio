import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SquishSwitch from '../reactbits/SquishSwitch';
import './Navbar.css';

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const burgerBtnRef = useRef(null);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        burgerBtnRef.current &&
        !burgerBtnRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu automatically when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar-sticky-header">
      <div className="navbar">
        {/* Left side: Portfolio Brand link */}
        <a href="#home" className="navbar-brand" onClick={handleLinkClick}>
          Portfolio
        </a>

        {/* Desktop Navigation Links (Hidden on phone / tablet) */}
        <nav className="navbar-desktop-nav" aria-label="Main Navigation">
          <ul className="navbar-links">
            <li>
              <a href="#home" className="navbar-link">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="navbar-link">
                About
              </a>
            </li>
            <li>
              <a href="#skills" className="navbar-link">
                Skills
              </a>
            </li>
            <li>
              <a href="#projects" className="navbar-link">
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" className="navbar-link">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Right side controls: Burger Menu + Theme Toggle at the end right */}
        <div className="navbar-right-controls">
          <button
            ref={burgerBtnRef}
            type="button"
            className={`navbar-burger-btn ${isMenuOpen ? 'navbar-burger-btn--open' : ''}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="burger-bar burger-bar--1" />
            <span className="burger-bar burger-bar--2" />
            <span className="burger-bar burger-bar--3" />
          </button>

          {/* Dark / Light Mode Switch (at the end right) */}
          <div className="navbar-theme-toggle">
            <SquishSwitch
              checked={darkMode}
              onChange={setDarkMode}
              trackColor="#e4e4e7"
              trackOnColor="#1e293b"
              thumbColor="#ffffff"
              thumbOnColor="#0f172a"
              width={60}
              height={32}
              radius={16}
              speed={50}
              stretch={32}
              hoverScale={1.035}
              colorDuration={320}
              ariaLabel="Toggle dark mode"
            />
          </div>
        </div>

        {/* Dropdown Menu placed at the right top underneath the header */}
        <div
          ref={dropdownRef}
          className={`navbar-dropdown-menu ${isMenuOpen ? 'navbar-dropdown-menu--open' : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="navbar-dropdown-links">
            <li>
              <a href="#home" className="navbar-dropdown-link" onClick={handleLinkClick}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#about" className="navbar-dropdown-link" onClick={handleLinkClick}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>About</span>
              </a>
            </li>
            <li>
              <a href="#skills" className="navbar-dropdown-link" onClick={handleLinkClick}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Skills</span>
              </a>
            </li>
            <li>
              <a href="#projects" className="navbar-dropdown-link" onClick={handleLinkClick}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Projects</span>
              </a>
            </li>
            <li>
              <a href="#contact" className="navbar-dropdown-link" onClick={handleLinkClick}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Contact</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
