import React from 'react';
import { StyledCountBadge } from './style';
export type CountBadgeType = 'default' | 'primary' | 'danger'
export type CountBadgeProps = {
    type?: CountBadgeType
}
const CountBadge: React.FC<CountBadgeProps & {
    count: number
}> = ({ count, ...props }) => {
    return <StyledCountBadge data-testid={`count-badge-${props.type}`} {...props} >
        {count}
    </StyledCountBadge>
}

export default CountBadge
