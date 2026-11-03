import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, startTransition } from 'react';

const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {}
});

// Apply theme classes straight to <html> so CSS colors swap instantly,
// independent of React re-render timing.
function applyThemeToDocument(isDark) {
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

let switchTimer = 0;

// Temporarily disable every CSS transition during the swap. Without this,
// dozens of elements animate background/color at once over blurred layers,
// which is what makes mobile feel laggy.
function suppressTransitions() {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  clearTimeout(switchTimer);
  switchTimer = setTimeout(() => {
    root.classList.remove('theme-switching');
  }, 120);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkModeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    return false;
  });

  const darkRef = useRef(darkMode);

  // Keep <html> in sync (initial load and any external updates)
  useLayoutEffect(() => {
    darkRef.current = darkMode;
    applyThemeToDocument(darkMode);
  }, [darkMode]);

  const setDarkMode = useCallback(value => {
    const prev = darkRef.current;
    const next = typeof value === 'function' ? Boolean(value(prev)) : Boolean(value);
    if (next === prev) return;

    // 1. Instant visual swap via CSS (cheap)
    darkRef.current = next;
    suppressTransitions();
    applyThemeToDocument(next);

    // 2. Defer the heavy React re-render so the toggle animation stays smooth
    startTransition(() => {
      setDarkModeState(next);
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
