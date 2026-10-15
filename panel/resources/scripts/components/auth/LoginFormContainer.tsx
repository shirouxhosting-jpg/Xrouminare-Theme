import React, { forwardRef } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import { XrouLogo, XrouWordmark } from '@/components/xrou/Logo';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
};

/**
 * XROUMINARE auth card: brand panel on the left (hidden on mobile), form on
 * the right. Keeps every security mechanism (CSRF, sessions, reCAPTCHA) from
 * the stock Pterodactyl login flow — only the presentation changes.
 */
export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <div className={'w-full max-w-4xl mx-auto px-2'}>
        <FlashMessageRender className={'mb-3'} />
        <Form {...props} ref={ref}>
            <div className={'xrou-card overflow-hidden md:flex'}>
                {/* Brand panel */}
                <div
                    className={'hidden md:flex flex-col justify-between w-[300px] flex-shrink-0 p-8'}
                    style={{ backgroundColor: 'var(--xrou-surface)', borderRight: '2px solid var(--xrou-border-strong)' }}
                >
                    <div className={'relative'}>
                        {/* small decorative squares */}
                        <span
                            aria-hidden={'true'}
                            className={'absolute -right-2 -top-2 rounded-md rotate-12'}
                            style={{ width: 18, height: 18, backgroundColor: 'var(--xrou-yellow)', border: '2px solid var(--xrou-border-strong)' }}
                        />
                        <span
                            aria-hidden={'true'}
                            className={'absolute right-10 top-8 rounded-md -rotate-6'}
                            style={{ width: 12, height: 12, backgroundColor: 'var(--xrou-pink)', border: '2px solid var(--xrou-border-strong)' }}
                        />
                        <XrouWordmark size={40} />
                    </div>
                    <div>
                        <p className={'text-lg font-header font-extrabold leading-snug'} style={{ color: 'var(--xrou-text)' }}>
                            One Panel.
                            <br />
                            Endless Possibilities.
                        </p>
                        <p className={'mt-2 text-sm leading-relaxed'} style={{ color: 'var(--xrou-text-2)' }}>
                            Kelola semua server game Anda dalam satu dashboard yang cepat, aman, dan menyenangkan.
                        </p>
                    </div>
                    <div className={'flex items-center gap-2'}>
                        {['var(--xrou-cyan)', 'var(--xrou-yellow)', 'var(--xrou-pink)', 'var(--xrou-green)', 'var(--xrou-purple)'].map(
                            (color) => (
                                <span
                                    key={color}
                                    aria-hidden={'true'}
                                    className={'inline-block rounded-full'}
                                    style={{ width: 12, height: 12, backgroundColor: color, border: '2px solid var(--xrou-border-strong)' }}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Form panel */}
                <div className={'flex-1 p-6 sm:p-8'}>
                    <div className={'md:hidden mb-6 flex justify-center'}>
                        <XrouLogo size={48} />
                    </div>
                    {title && (
                        <h1 className={'text-2xl font-header font-extrabold'} style={{ color: 'var(--xrou-text)' }}>
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className={'mt-1 mb-6 text-sm'} style={{ color: 'var(--xrou-text-2)' }}>
                            {subtitle}
                        </p>
                    )}
                    {props.children}
                </div>
            </div>
        </Form>
        <p className={'text-center mt-4 text-xs'} style={{ color: 'var(--xrou-text-3)' }}>
            &copy; 2015 - {new Date().getFullYear()}&nbsp;
            <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io'}
                target={'_blank'}
                className={'no-underline'}
                style={{ color: 'var(--xrou-text-3)' }}
            >
                Pterodactyl Software
            </a>
            <span className={'mx-1.5'}>•</span>
            Powered by XROUMINARE
        </p>
    </div>
));
