import React from 'react';
import { StyledLargeIcon } from './style';
const LargeIcon: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <StyledLargeIcon data-testId="large-icon">
        {children}
    </StyledLargeIcon>
}

export default LargeIcon
