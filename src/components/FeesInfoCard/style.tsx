import { Collapse } from 'antd';
import styled from 'styled-components';
export const StyledCollapse = styled(Collapse)`
    background-color: transparent;
    border: none;
    & .ant-collapse-header{
        border: none;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: ${({ theme }) => theme.color500};
    }
    & .ant-collapse-content{
        border:none;
    }
`
