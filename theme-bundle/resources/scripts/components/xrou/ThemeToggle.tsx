import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdjust, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { XrouThemeMode, useXrouTheme } from '@/components/xrou/themeStore';

const options: { value: XrouThemeMode; label: string; icon: typeof faSun }[] = [
    { value: 'light', label: 'Light', icon: faSun },
    { value: 'system', label: 'System', icon: faAdjust },
    { value: 'dark', label: 'Dark', icon: faMoon },
];

/**
 * Segmented light / system / dark switch. Rendered inside a bordered
 * "toothy" card so it matches the rest of the XROUMINARE kit.
 */
const XrouThemeToggle = ({ label = 'Mode' }: { label?: string }) => {
    const { mode, setMode } = useXrouTheme();

    return (
        <div className={'xrou-card-flat px-3 py-2.5 flex items-center justify-between gap-3 w-full'}>
            <span
                className={'text-xs font-bold uppercase tracking-wider'}
                style={{ color: 'var(--xrou-text-3)' }}
            >
                {label}
            </span>
            <div
                className={'flex items-center rounded-md overflow-hidden'}
                style={{ border: '2px solid var(--xrou-border-strong)' }}
                role={'radiogroup'}
                aria-label={'Theme'}
            >
                {options.map(({ value, label: optionLabel, icon }) => {
                    const active = mode === value;
                    return (
                        <button
                            key={value}
                            type={'button'}
                            role={'radio'}
                            aria-checked={active}
                            title={`Theme: ${optionLabel}`}
                            onClick={() => setMode(value)}
                            className={'px-2.5 py-1.5 transition-colors duration-150'}
                            style={{
                                backgroundColor: active ? 'var(--xrou-cyan)' : 'transparent',
                                color: active ? 'var(--xrou-cyan-text)' : 'var(--xrou-text-2)',
                            }}
                        >
                            <FontAwesomeIcon icon={icon} size={'sm'} fixedWidth />
                            <span className={'sr-only'}>{optionLabel}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default XrouThemeToggle;
