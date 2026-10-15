import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

/**
 * XROUMINARE brand mark: a hand-rolled "X" on a rounded card with the
 * signature hard shadow. Two-tone stroke (cyan -> purple) keeps it playful
 * without relying on gradients everywhere.
 */
export const XrouLogo = ({ size = 40, className }: LogoProps) => (
    <svg
        width={size}
        height={size}
        viewBox={'0 0 48 48'}
        fill={'none'}
        xmlns={'http://www.w3.org/2000/svg'}
        className={className}
        aria-hidden={'true'}
    >
        <defs>
            <linearGradient id={'xrou-x-gradient'} x1={'14'} y1={'14'} x2={'34'} y2={'34'} gradientUnits={'userSpaceOnUse'}>
                <stop offset={'0'} stopColor={'#62C4D4'} />
                <stop offset={'1'} stopColor={'#8175F5'} />
            </linearGradient>
        </defs>
        <rect x={'5.5'} y={'5.5'} width={'40'} height={'40'} rx={'11'} fill={'var(--xrou-shadow)'} />
        <rect x={'2.5'} y={'2.5'} width={'40'} height={'40'} rx={'11'} fill={'var(--xrou-elevated)'} stroke={'var(--xrou-border-strong)'} strokeWidth={'2.5'} />
        <path
            d={'M13 13.5L32 31.5M32 13.5L13 31.5'}
            stroke={'url(#xrou-x-gradient)'}
            strokeWidth={'6.5'}
            strokeLinecap={'round'}
        />
    </svg>
);

interface WordmarkProps {
    size?: number;
    compact?: boolean;
}

export const XrouWordmark = ({ size = 36, compact = false }: WordmarkProps) => (
    <span className={'inline-flex items-center gap-3 select-none'}>
        <XrouLogo size={size} />
        <span className={'leading-none'}>
            <span
                className={'block font-header font-extrabold tracking-wide'}
                style={{ fontSize: size * 0.5, color: 'var(--xrou-text)' }}
            >
                XROUMINARE
            </span>
            {!compact && (
                <span
                    className={'block font-header font-semibold mt-1'}
                    style={{ fontSize: Math.max(9, size * 0.22), color: 'var(--xrou-text-3)' }}
                >
                    One Panel. Endless Possibilities.
                </span>
            )}
        </span>
    </span>
);

export default XrouLogo;
