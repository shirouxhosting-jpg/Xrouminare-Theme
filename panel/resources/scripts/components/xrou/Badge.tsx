import React from 'react';

type Variant = 'success' | 'danger' | 'warning' | 'info' | 'accent' | 'neutral';

interface BadgeProps {
    variant?: Variant;
    withDot?: boolean;
    className?: string;
    children: React.ReactNode;
}

const variantClass: Record<Variant, string> = {
    success: 'xrou-badge-success',
    danger: 'xrou-badge-danger',
    warning: 'xrou-badge-warning',
    info: 'xrou-badge-info',
    accent: 'xrou-badge-accent',
    neutral: 'xrou-badge-neutral',
};

const dotColor: Record<Variant, string> = {
    success: '#4AA96E',
    danger: '#E14F66',
    warning: '#E08F0A',
    info: '#3FA9BC',
    accent: '#8175F5',
    neutral: 'var(--xrou-text-3)',
};

const XrouBadge = ({ variant = 'neutral', withDot = false, className = '', children }: BadgeProps) => (
    <span className={`xrou-badge ${variantClass[variant]} ${className}`}>
        {withDot && (
            <span
                aria-hidden={'true'}
                className={'inline-block rounded-full'}
                style={{ width: 6, height: 6, backgroundColor: dotColor[variant] }}
            />
        )}
        {children}
    </span>
);

export default XrouBadge;
