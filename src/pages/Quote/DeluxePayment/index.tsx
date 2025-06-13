import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SubmitButton from '../../../components/Form/SubmitButton';
import { RootState } from '../../../utils/redux/store';
import { PageHeader } from '../../style';

const DeluxePayment: React.FC = () => {
    const navigate = useNavigate();
    const [showEmbed, setShowEmbed] = useState(false);
    const deluxeToken = useSelector(({ auth }: RootState) => (auth.agency as any)?.deluxe_partner_token);

    useEffect(() => {
        if (showEmbed) {
            const script = document.createElement('script');
            script.src = 'https://hostedpaymentform.deluxe.com/v2/deluxe.js';
            script.onload = () => {
                const HostedForm = (window as any).HostedForm;
                if (HostedForm) {
                    const options = {
                        containerId: 'deluxe-container',
                        xtoken: deluxeToken,
                        xrtype: 'Create Vault',
                        xpm: '0',
                        xdisplayvafields: 'true',
                        xcssid: 'mycustomcss'
                    };
                    HostedForm.init(options, {
                        onSuccess: (data: unknown) => {
                            console.log(JSON.stringify(data));
                            alert('Payment method added successfully');
                            navigate('/agency/quote/customer-info');
                        },
                        onFailure: (data: unknown) => { console.log(JSON.stringify(data)); },
                        onInvalid: (data: unknown) => { console.log(JSON.stringify(data)); }
                    }).then((instance: any) => instance.renderHpf());
                }
            };
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [showEmbed, deluxeToken, navigate]);

    return (
        <Row gutter={[0, 20]} justify={"center"}>
            <Col span={24} style={{ textAlign: 'center' }}>
                <PageHeader level={2}>Add Customer To Deluxe</PageHeader>
            </Col>
            <Col span={24} style={{ textAlign: 'center', marginTop: '24px' }}>
                {!showEmbed && (
                    <SubmitButton onClick={() => setShowEmbed(true)}>
                        Add Customer to Deluxe
                    </SubmitButton>
                )}
            </Col>
            <Col span={24}>
                {showEmbed && <div id="deluxe-container" style={{ width: '100%' }} />}
            </Col>
        </Row>
    );
};

export default DeluxePayment;
