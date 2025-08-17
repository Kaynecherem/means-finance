import { Button } from 'antd';
import React, { useState } from 'react';
import { useDirectUs } from '../../components/DirectUs/DirectusContext';
import { fetchCustomerAgencyFlowNew } from '../../utils/apis/directus';

const FlowTest2: React.FC = () => {
    const { directusClient } = useDirectUs();
    const [response, setResponse] = useState<any>(null);

    const handleClick = async () => {
        try {
            const res = await fetchCustomerAgencyFlowNew(directusClient, {
                agency: '38',
                customer_id: 'c2588d23-b486-419c-bd8f-306d849a2e21',
            });
            setResponse(res);
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Button onClick={handleClick}>Trigger Flow</Button>
            {response && (
                <pre>{JSON.stringify(response, null, 2)}</pre>
            )}
        </div>
    );
};

export default FlowTest2;
