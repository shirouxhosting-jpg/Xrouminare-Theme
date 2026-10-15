import { useEffect, useState } from 'react';

export type XrouThemeMode = 'light' | 'dark' | 'system';
export type XrouResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'xrou-theme';

const listeners = new Set<() => void>();

function readStoredMode(): XrouThemeMode {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        if (value === 'light' || value === 'dark' || value === 'system') {
            return value;
        }
    } catch {
        /* localStorage can be unavailable (private mode); fall through */
    }
    return 'system';
}

export function systemPrefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getResolvedTheme(): XrouResolvedTheme {
    const mode = readStoredMode();
    if (mode === 'system') {
        return systemPrefersDark() ? 'dark' : 'light';
    }
    return mode;
}

function applyTheme(): void {
    const resolved = getResolvedTheme();
    const root = document.documentElement;
    root.classList.toggle('xrou-light', resolved === 'light');
    root.classList.toggle('xrou-dark', resolved === 'dark');
    root.style.colorScheme = resolved;
}

export function getXrouThemeMode(): XrouThemeMode {
    return readStoredMode();
}

export function setXrouThemeMode(mode: XrouThemeMode): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
        /* ignore */
    }
    applyTheme();
    listeners.forEach((listener) => listener());
}

// Apply as early as possible (the wrapper blade also has an inline script to
// avoid a flash, this keeps things in sync after hydration).
applyTheme();

// Follow the OS preference while in "system" mode.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getXrouThemeMode() === 'system') {
        applyTheme();
        listeners.forEach((listener) => listener());
    }
});

export function useXrouTheme(): { mode: XrouThemeMode; resolved: XrouResolvedTheme; setMode: (m: XrouThemeMode) => void } {
    const [mode, setMode] = useState<XrouThemeMode>(() => getXrouThemeMode());
    const [resolved, setResolved] = useState<XrouResolvedTheme>(() => getResolvedTheme());

    useEffect(() => {
        const update = () => {
            setMode(getXrouThemeMode());
            setResolved(getResolvedTheme());
        };
        listeners.add(update);
        return () => {
            listeners.delete(update);
        };
    }, []);

    return { mode, resolved, setMode: setXrouThemeMode };
}
