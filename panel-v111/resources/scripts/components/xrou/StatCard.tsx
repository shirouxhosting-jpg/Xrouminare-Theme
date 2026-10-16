import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type XrouAccent = 'cyan' | 'yellow' | 'pink' | 'green' | 'purple' | 'neutral';

const accentChip: Record<XrouAccent, { background: string; color: string }> = {
    cyan: { background: 'var(--xrou-cyan)', color: 'var(--xrou-cyan-text)' },
    yellow: { background: 'var(--xrou-yellow)', color: 'var(--xrou-yellow-text)' },
    pink: { background: 'var(--xrou-pink)', color: 'var(--xrou-pink-text)' },
    green: { background: 'var(--xrou-green)', color: 'var(--xrou-green-text)' },
    purple: { background: 'var(--xrou-purple)', color: 'var(--xrou-purple-text)' },
    neutral: { background: 'var(--xrou-chip)', color: 'var(--xrou-text)' },
};

interface StatCardProps {
    label: string;
    value: React.ReactNode;
    icon: IconDefinition;
    accent?: XrouAccent;
    footer?: React.ReactNode;
}

/**
 * Dashboard statistic card with a colored icon chip and a bold value.
 */
const XrouStatCard = ({ label, value, icon, accent = 'cyan', footer }: StatCardProps) => (
    <div className={'xrou-card p-4 flex items-start justify-between gap-3'}>
        <div className={'min-w-0'}>
            <p className={'text-xs font-bold uppercase tracking-wider truncate'} style={{ color: 'var(--xrou-text-3)' }}>
                {label}
            </p>
            <p
                className={'mt-1.5 font-header font-extrabold leading-none'}
                style={{ color: 'var(--xrou-text)', fontSize: '1.75rem' }}
            >
                {value}
            </p>
            {footer && <div className={'mt-2'}>{footer}</div>}
        </div>
        <span
            className={'flex items-center justify-center flex-shrink-0'}
            style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: '2px solid var(--xrou-border-strong)',
                boxShadow: '3px 3px 0 var(--xrou-shadow)',
                ...accentChip[accent],
            }}
        >
            <FontAwesomeIcon icon={icon} />
        </span>
    </div>
);

export default XrouStatCard;
