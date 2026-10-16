import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

// XROUMINARE inputs: solid surface, strong border, hard focus shadow.
const light = css<Props>`
    background-color: #ffffff;
    border: 2px solid var(--xrou-border-strong);
    color: var(--xrou-text);

    &:focus {
        border-color: var(--xrou-border-strong);
        box-shadow: 3px 3px 0 var(--xrou-focus);
    }

    &:disabled {
        background-color: var(--xrou-chip-soft);
        border-color: var(--xrou-border);
    }
`;

const checkboxStyle = css<Props>`
    ${tw`bg-neutral-500 cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-4 h-4 text-purple-400 border border-neutral-300 rounded-sm`};
    color-adjust: exact;
    background-origin: border-box;
    transition: all 75ms linear, box-shadow 25ms linear;

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: currentColor;
        background-size: 100% 100%;
    }

    &:focus {
        ${tw`outline-none border-purple-300`};
        box-shadow: 0 0 0 1px rgba(129, 117, 245, 0.35);
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-3 border-2 rounded-md text-sm`};
    background-color: var(--xrou-input);
    color: var(--xrou-text);
    border: 2px solid var(--xrou-border-strong);
    transition: box-shadow 140ms ease, border-color 140ms ease, background-color 140ms ease;

    & + .input-help {
        ${tw`mt-1 text-xs`};
        ${(props) => (props.hasError ? tw`text-red-200` : tw`text-neutral-300`)};
    }

    &:required,
    &:invalid {
        box-shadow: none;
    }

    &:not(:disabled):not(:read-only):focus {
        outline: none;
        border-color: var(--xrou-border-strong);
        box-shadow: 3px 3px 0 var(--xrou-focus);
        ${(props) => props.hasError && tw`border-red-400`};
    }

    &:disabled {
        ${tw`opacity-75`};
    }

    ${(props) => props.isLight && light};
    ${(props) => props.hasError && tw`border-red-400`};
`;

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${checkboxStyle};

        &[type='radio'] {
            ${tw`rounded-full`};
        }
    }
`;
const Textarea = styled.textarea<Props>`
    ${inputStyle}
`;

export { Textarea };
export default Input;
