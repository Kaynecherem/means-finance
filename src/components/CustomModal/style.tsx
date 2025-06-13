import { Modal } from "antd";
import styled from "styled-components";

export const StyledCustomModal = styled(Modal)`
    & .ant-modal-content{
        border-radius: 16px;
        padding: 24px;
    }
    & .ant-modal-close{
        width: 44px;
        height: 44px;
        border-radius: 8px;
        border: 1px solid ${({ theme }) => theme.color300};
        background-color: transparent;
        top: 24px;
        right: 24px;
        & .ant-modal-close-x{
            color: ${({ theme }) => theme.color700};
            font-size: 20px;
        }
    }
    & .ant-modal-header{
        margin-bottom: 16px;
        & .ant-modal-title{
            font-size: 18px;
            font-weight: 500;
            line-height: 28px;
            color: ${({ theme }) => theme.color900};
            padding: 8px 0px;
        }
    }
`   
