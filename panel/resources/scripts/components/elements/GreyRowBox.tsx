import styled from 'styled-components/macro';
import tw from 'twin.macro';

// XROUMINARE: rows get the card treatment (solid surface, strong border,
// hard shadow) instead of the old flat gray strip.
export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-md no-underline items-center p-4 border-2 transition-all duration-150 overflow-hidden`};
    background-color: var(--xrou-elevated);
    border-color: var(--xrou-border-strong);
    color: var(--xrou-text);

    ${(props) =>
        props.$hoverable !== false &&
        `
        &:hover {
            transform: translate(-1px, -1px);
            box-shadow: var(--xrou-shadow-offset) var(--xrou-shadow-offset) 0 var(--xrou-shadow);
        }
    `};

    & .icon {
        ${tw`rounded-lg w-16 flex items-center justify-center p-3`};
        background-color: var(--xrou-chip);
        border: 2px solid var(--xrou-border-strong);
    }
`;
