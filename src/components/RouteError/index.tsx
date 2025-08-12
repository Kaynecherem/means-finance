import { Button } from 'antd';
import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

const RouteError: React.FC = () => {
    const error = useRouteError() as { statusText?: string; message?: string };
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/', { replace: true });
    };

    return (
        <div style={{ padding: 24, textAlign: 'center' }}>
            <h1>Something went wrong</h1>
            <p>{error?.statusText || error?.message || 'An unexpected error occurred.'}</p>
            <Button type="primary" onClick={handleHome} style={{ marginTop: 16 }}>
                Go to Home
            </Button>
        </div>
    );
};

export default RouteError;
