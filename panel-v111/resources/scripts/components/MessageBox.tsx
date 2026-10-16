import * as React from 'react';
import tw, { TwStyle } from 'twin.macro';
import styled from 'styled-components/macro';

export type FlashMessageType = 'success' | 'info' | 'warning' | 'error';

interface Props {
    title?: string;
    children: string;
    type?: FlashMessageType;
}

// XROUMINARE: toast messages use soft accent backgrounds with strong borders,
// mirroring the badge palette.
const styling = (type?: FlashMessageType): TwStyle | string => {
    switch (type) {
        case 'error':
            return tw`bg-red-100 border-red-400`;
        case 'info':
            return tw`bg-cyan-100 border-cyan-400`;
        case 'success':
            return tw`bg-green-100 border-green-400`;
        case 'warning':
            return tw`bg-yellow-100 border-yellow-400`;
        default:
            return '';
    }
};

const titleStyling = (type?: FlashMessageType): TwStyle | string => {
    switch (type) {
        case 'error':
            return tw`bg-red-400 text-red-900`;
        case 'info':
            return tw`bg-cyan-400 text-cyan-900`;
        case 'success':
            return tw`bg-green-400 text-green-900`;
        case 'warning':
            return tw`bg-yellow-400 text-yellow-900`;
        default:
            return '';
    }
};

const Container = styled.div<{ $type?: FlashMessageType }>`
    ${tw`p-3 border-2 items-center leading-normal rounded-lg flex w-full text-sm`};
    ${tw`shadow-md`};
    ${(props) => styling(props.$type)};
    color: var(--xrou-text);
    border-color: var(--xrou-border-strong);
`;
Container.displayName = 'MessageBox.Container';

const MessageBox = ({ title, children, type }: Props) => (
    <Container css={tw`lg:inline-flex`} $type={type} role={'alert'}>
        {title && (
            <span
                className={'title'}
                css={[
                    tw`flex rounded-full uppercase px-2 py-1 text-xs font-bold mr-3 leading-none`,
                    titleStyling(type),
                ]}
            >
                {title}
            </span>
        )}
        <span css={tw`mr-2 text-left flex-auto`}>{children}</span>
    </Container>
);
MessageBox.displayName = 'MessageBox';

export default MessageBox;
