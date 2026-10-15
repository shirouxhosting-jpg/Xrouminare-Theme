import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: typeof faBoxOpen;
    action?: React.ReactNode;
}

const XrouEmptyState = ({ title, description, icon = faBoxOpen, action }: EmptyStateProps) => (
    <div className={'xrou-card-flat px-6 py-14 flex flex-col items-center text-center'}>
        <div
            className={'flex items-center justify-center mb-4'}
            style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: 'var(--xrou-chip)',
                border: '2px solid var(--xrou-border-strong)',
                color: 'var(--xrou-cyan-text)',
                background: 'var(--xrou-cyan)',
            }}
        >
            <FontAwesomeIcon icon={icon} size={'lg'} />
        </div>
        <p className={'text-base font-header font-bold'} style={{ color: 'var(--xrou-text)' }}>
            {title}
        </p>
        {description && (
            <p className={'mt-1.5 text-sm max-w-md'} style={{ color: 'var(--xrou-text-2)' }}>
                {description}
            </p>
        )}
        {action && <div className={'mt-5'}>{action}</div>}
    </div>
);

export default XrouEmptyState;
