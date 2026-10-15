import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Renders without the hard offset shadow (border only). */
    flat?: boolean;
}

/**
 * Saweria-style card: solid surface, thin strong border, hard offset shadow.
 */
const XrouCard = ({ flat = false, className = '', children, ...rest }: CardProps) => (
    <div className={`${flat ? 'xrou-card-flat' : 'xrou-card'} ${className}`} {...rest}>
        {children}
    </div>
);

export default XrouCard;
