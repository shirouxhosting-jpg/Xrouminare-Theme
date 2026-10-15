import React from 'react';

interface SkeletonProps {
    /** Width in CSS units, defaults to 100%. */
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Loading placeholder with a soft shimmer, styled with the theme chip color.
 */
const XrouSkeleton = ({ width = '100%', height = 16, className = '', style }: SkeletonProps) => (
    <div
        className={`xrou-skeleton ${className}`}
        style={{ width, height, ...style }}
        aria-hidden={'true'}
    />
);

const XrouLoadingSkeleton = () => (
    <div className={'space-y-3'} role={'status'} aria-label={'Loading'}>
        <div className={'xrou-card p-4 space-y-3'}>
            <XrouSkeleton height={18} width={'35%'} />
            <XrouSkeleton height={12} width={'60%'} />
            <div className={'flex gap-3 pt-1'}>
                <XrouSkeleton height={44} width={44} />
                <XrouSkeleton height={44} />
            </div>
        </div>
        <div className={'xrou-card p-4 space-y-3'}>
            <XrouSkeleton height={18} width={'28%'} />
            <XrouSkeleton height={12} width={'52%'} />
            <div className={'flex gap-3 pt-1'}>
                <XrouSkeleton height={44} width={44} />
                <XrouSkeleton height={44} />
            </div>
        </div>
    </div>
);

export { XrouLoadingSkeleton };
export default XrouSkeleton;
