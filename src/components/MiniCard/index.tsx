import React from 'react';
import Box from '../Box';
import { StyledMiniCard } from './style';
const MiniCard: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Box>
        <StyledMiniCard>{children}</StyledMiniCard>
    </Box>
}
export default MiniCard
