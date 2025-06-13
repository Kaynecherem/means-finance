import React from 'react';
import { CSSProperties } from 'styled-components';
import { StyledBoxContainer } from './style';
const BoxContainer: React.FC<{
    style?: CSSProperties
} & React.PropsWithChildren> = ({ children, style }) => {
    return <StyledBoxContainer data-testid="box-container" style={style}>
        {children}
    </StyledBoxContainer>
}

export default BoxContainer
