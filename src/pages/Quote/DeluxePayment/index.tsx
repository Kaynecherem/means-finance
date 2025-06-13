import { Col, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
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
        const handleMessage = (e: MessageEvent) => {
            if (e.data === 'deluxe_success') {
                alert('Payment method added successfully');
                navigate('/agency/quote/customer-info');
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    const iframeDoc = useMemo(() => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://hostedpaymentform.deluxe.com/v2/deluxe.js"></script>
  <style id="mycustomcss">
    body {
      padding: 24px;
      border-radius: 25px;
      height: 100%;
    }
    .form-control {
      color: green;
      border: 1px solid #0d6efd;
    }
    .form-label {
      color: black;
    }
    .btn {
      color: green;
      border: 1px solid green;
    }
    /* In the iframe's CSS */
    .iframe-wrapper #dppPaymentContainer {
      height: 100% !important;
    }
  </style>
</head>
<body>
<div id="mycontainer"></div>
<script>
  var options = {
    containerId: "mycontainer",
    xtoken: "${deluxeToken}",
    xrtype: "Create Vault",
    xpm: "0",
    xdisplayvafields: "true",
    xcssid: "mycustomcss"
  };

  HostedForm.init(options, {
    onSuccess: function(data) {
      console.log(JSON.stringify(data));
      window.parent.postMessage('deluxe_success', '*');
    },
    onFailure: function(data) { console.log(JSON.stringify(data)); },
    onInvalid: function(data) { console.log(JSON.stringify(data)); }
  }).then(function(instance) { instance.renderHpf(); });
</script>
</body>
</html>`;
    }, [deluxeToken]);

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
                {showEmbed && (
                    <iframe
                        title="Deluxe Payment"
                        srcDoc={iframeDoc}
                        style={{ width: '100%', border: 'none', height: '700px' }}
                    />
                )}
            </Col>
        </Row>
    );
};

export default DeluxePayment;
