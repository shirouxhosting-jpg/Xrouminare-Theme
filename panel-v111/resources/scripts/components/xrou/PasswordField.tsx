import React, { useState } from 'react';
import { useField } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';

interface Props {
    name: string;
    id?: string;
    label?: string;
    description?: string;
    autoComplete?: string;
    disabled?: boolean;
}

/**
 * Password input with a show/hide toggle, styled like the rest of the
 * XROUMINARE kit. Formik-compatible drop-in for `<Field type="password" />`.
 */
const XrouPasswordField = ({ name, id, label, description, autoComplete, disabled }: Props) => {
    const [visible, setVisible] = useState(false);
    const [field, meta] = useField(name);
    const hasError = !!(meta.touched && meta.error);
    const inputId = id || name;

    return (
        <div>
            {label && <Label htmlFor={inputId}>{label}</Label>}
            <div className={'relative'}>
                <Input
                    id={inputId}
                    type={visible ? 'text' : 'password'}
                    {...field}
                    disabled={disabled}
                    autoComplete={autoComplete || 'current-password'}
                    hasError={hasError}
                    style={{ paddingRight: '2.75rem' }}
                />
                <button
                    type={'button'}
                    onClick={() => setVisible((v) => !v)}
                    title={visible ? 'Hide password' : 'Show password'}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    className={'absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-1 rounded transition-colors'}
                    style={{ color: 'var(--xrou-text-3)' }}
                >
                    <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} size={'sm'} />
                </button>
            </div>
            {hasError ? (
                <p className={'input-help error'}>{meta.error!.charAt(0).toUpperCase() + meta.error!.slice(1)}</p>
            ) : description ? (
                <p className={'input-help'}>{description}</p>
            ) : null}
        </div>
    );
};

export default XrouPasswordField;
