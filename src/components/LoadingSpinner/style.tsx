import styled from "styled-components";
import { LoadingSpinnerProps } from './index';

export const LoadingSpinnerWrapper = styled.div<LoadingSpinnerProps>`
    width: ${({ fullScreen }) => fullScreen ? "100vw" : "100%"};
    height: ${({ fullScreen }) => fullScreen ? "100vh" : "100%"};
    position: ${({ fullScreen }) => fullScreen ? "absolute" : "unset"};
    top: ${({ fullScreen }) => fullScreen ? "0" : "unset"};
    left: ${({ fullScreen }) => fullScreen ? "0" : "unset"};
    z-index: ${({ fullScreen }) => fullScreen ? "1" : "unset"};
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    & .ant-spin .anticon{
        font-size: 50px;
    }
`
