import { Table, TableProps } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import styled from 'styled-components';
export const StyledTable = styled(Table) <TableProps<AnyObject>>`
    & .ant-table-cell{
        white-space: nowrap;
    }
    & .ant-table-thead{
        & .ant-table-cell{
            background-color:  ${({ theme }) => theme.color50};
            border-bottom:  1px solid ${({ theme }) => theme.color200};
            font-size: 12px;
            font-weight: 500;
            line-height: 18px;
            color:  ${({ theme }) => theme.color500};
            padding: 13px;
            &::before{
                display: none;
            }
        }
    }
    & .ant-table-tbody{
        & .ant-table-row{
            & .ant-table-cell{
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                color:  ${({ theme }) => theme.color900};
                padding: 26px 12px;
                border-bottom:  1px solid ${({ theme }) => theme.color200};
            }
        }
    }
`
