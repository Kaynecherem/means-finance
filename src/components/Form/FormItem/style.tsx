import { Form, FormItemProps } from 'antd';
import styled from "styled-components";


export const StyledFromItemContainer = styled.div`
display: flex;
`
export const FormIconContainer = styled.div`
    width: 42px;
    margin-right: 14px;
    margin-top: 14px;
`
export const StyledFormItem = styled(Form.Item) <FormItemProps & { hideLabel?: boolean }>`
    margin:0;
    flex:1;
    max-width: 100%;
    & .ant-form-item-label{
        display: ${({ hideLabel }) => hideLabel ? 'none' : ''};
    }
    & .ant-form-item-label label{
        color: ${({ theme }) => theme.color700};
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
    }

    & .ant-form-item-explain-error{
        position: absolute;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 100%;
        font-size: 12px;
    }
`
