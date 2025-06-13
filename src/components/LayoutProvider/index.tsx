import { Layout } from 'antd';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import { LoadingSpinner } from '../LoadingSpinner';
import { AppLayout } from './style';

const { Content } = Layout
const LayoutProvider: React.FC = () => {
    return (
        <AppLayout>
            <Header />
            <Content>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <Outlet />
                </Suspense>
            </Content>
        </AppLayout>
    );
}

export default LayoutProvider;
