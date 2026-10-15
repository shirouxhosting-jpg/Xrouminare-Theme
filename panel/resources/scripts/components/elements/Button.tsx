import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

/*
 | XROUMINARE buttons: solid accent colors, a thin strong border and the
 | signature hard offset shadow with a playful press interaction. The public
 | API (color / isSecondary / size / isLoading) is unchanged from stock
 | Pterodactyl so every existing screen keeps working.
 */
const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-block rounded-md p-2 tracking-wide text-sm`};
    font-weight: 800;
    border: 2px solid var(--xrou-border-strong);
    border-radius: 6px;
    box-shadow: var(--xrou-shadow-offset) var(--xrou-shadow-offset) 0 var(--xrou-shadow);
    transition:
        transform 140ms ease,
        box-shadow 140ms ease,
        background-color 140ms ease,
        opacity 140ms ease;

    &:hover:not(:disabled) {
        transform: translate(-1px, -1px);
        box-shadow: calc(var(--xrou-shadow-offset) + 1px) calc(var(--xrou-shadow-offset) + 1px) 0 var(--xrou-shadow);
    }

    &:active:not(:disabled) {
        transform: translate(3px, 3px);
        box-shadow: 2px 2px 0 var(--xrou-shadow);
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: 3px solid var(--xrou-focus);
        outline-offset: 3px;
    }

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            background-color: var(--xrou-cyan);
            color: var(--xrou-cyan-text);

            &:hover:not(:disabled) {
                background-color: var(--xrou-cyan-hover);
            }
        `};

    ${(props) =>
        props.color === 'grey' &&
        css`
            background-color: var(--xrou-chip);
            color: var(--xrou-text);

            &:hover:not(:disabled) {
                background-color: var(--xrou-chip-soft);
            }
        `};

    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            background-color: var(--xrou-green);
            color: var(--xrou-green-text);

            &:hover:not(:disabled) {
                background-color: var(--xrou-green-hover);
            }
        `};

    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            background-color: var(--xrou-pink);
            color: var(--xrou-pink-text);

            &:hover:not(:disabled) {
                background-color: var(--xrou-pink-hover);
            }
        `};

    ${(props) => props.size === 'xsmall' && tw`px-2 py-1 text-xs`};
    ${(props) => (!props.size || props.size === 'small') && tw`px-4 py-2`};
    ${(props) => props.size === 'large' && tw`p-4 text-sm`};
    ${(props) => props.size === 'xlarge' && tw`p-4 w-full`};

    ${(props) =>
        props.isSecondary &&
        css<Props>`
            background-color: transparent;
            color: var(--xrou-text);

            &:hover:not(:disabled) {
                ${(props) => props.color === 'red' && tw`bg-red-400`};
                ${(props) => props.color === 'primary' && tw`bg-cyan-300`};
                ${(props) => props.color === 'green' && tw`bg-green-300`};
                ${(props) => !props.color && tw`bg-cyan-300`};
            }
        `};

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
        box-shadow: 3px 3px 0 var(--xrou-shadow);
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div className={'flex absolute justify-center items-center w-full h-full left-0 top-0'}>
                <Spinner size={'small'} />
            </div>
        )}
        <span className={isLoading ? 'text-transparent' : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
