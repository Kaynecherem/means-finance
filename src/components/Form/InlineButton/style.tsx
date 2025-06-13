import { Button } from 'antd';
import styled from 'styled-components';
export const StyledInlineButton = styled(Button)`
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    padding: 10px 14px;
    &.ant-btn-default{
        font-weight: 400;
        border: 1px solid ${({ theme }) => theme.color300};
        color: ${({ theme }) => theme.color500};
        box-shadow: 0px 1px 2px 0px #1018280D;

    }

`
