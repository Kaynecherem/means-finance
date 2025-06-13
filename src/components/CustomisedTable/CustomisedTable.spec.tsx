import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import CustomizedTable from '.';

// Mock theme directly in the test file
const mockTheme = {
    color50: '#f0f0f0',
    color200: '#e0e0e0',
    color500: '#c0c0c0',
    color900: '#101828',
};

// Mock the Ant Design Table component
jest.mock('antd', () => ({
    Table: (props: any) => (
        <table>
            <thead>
                <tr>
                    {props.columns.map((col: any) => (
                        <th key={col.key}>{col.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.dataSource.map((row: any) => (
                    <tr key={row.key}>
                        {props.columns.map((col: any) => (
                            <td key={col.key}>{row[col.dataIndex]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    ),
}));


describe('CustomizedTable', () => {
    it('should render correctly with data', () => {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
        ];

        const data = [
            {
                key: '1',
                name: 'John Brown',
                age: 32,
            },
            {
                key: '2',
                name: 'Jim Green',
                age: 42,
            },
        ];

        render(
            <ThemeProvider theme={mockTheme}>
                <CustomizedTable columns={columns} dataSource={data} />
            </ThemeProvider>
        );

        expect(screen.getByText('John Brown')).toBeInTheDocument();
        expect(screen.getByText('Jim Green')).toBeInTheDocument();
        expect(screen.getByText('32')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render correctly without data', () => {
        render(
            <ThemeProvider theme={mockTheme}>
                <CustomizedTable columns={[]} dataSource={[]} />
            </ThemeProvider>
        );

        // Assuming the table should render an empty state or nothing
        // Replace 'No data' with the actual empty state if available
        expect(() => screen.getByText('No data')).toThrow();
    });
});
