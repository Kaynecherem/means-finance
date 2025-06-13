import React from 'react';
import { CSSProperties } from 'styled-components';
import { StyledBoxWrapper } from './style';
export type BoxWrapperType = 'large' | 'xl'
export type BoxWrapperProps = {
    type?: BoxWrapperType,
    style?: CSSProperties
}
const BoxWrapper: React.FC<React.PropsWithChildren<BoxWrapperProps>> = ({ children, type, style }) => {
    return <StyledBoxWrapper data-testid="box-wrapper" type={type} style={style}>
        {children}
    </StyledBoxWrapper>
}

export default BoxWrapper
