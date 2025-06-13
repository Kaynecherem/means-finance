import React from 'react';
import { StyledBox } from './style';
const Box: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <StyledBox data-testid="box">
        {children}
    </StyledBox>
}

export default Box
