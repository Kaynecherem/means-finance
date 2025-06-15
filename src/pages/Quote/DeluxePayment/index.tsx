import { Col, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SubmitButton from '../../../components/Form/SubmitButton';
import { useDirectUs } from '../../../components/DirectUs/DirectusContext';
import { resetQuote } from '../../../utils/redux/slices/quoteSlice';
import { updateAgency } from '../../../utils/redux/slices/authSlice';
import { RootState } from '../../../utils/redux/store';
import { getAgencyDeluxePartnerToken } from '../../../utils/apis/directus';
import { PageHeader } from '../../style';

const DeluxePayment: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPaymentAdded, setIsPaymentAdded] = useState(false);
    const deluxeToken = useSelector(({ auth }: RootState) => auth.agency?.deluxePartnerToken);
    const agencyId = useSelector(({ auth }: RootState) => auth.agency?.id);
    const { directusClient } = useDirectUs();

    useEffect(() => {
        const fetchToken = async () => {
            if (!deluxeToken && agencyId) {
                try {
                    const token = await getAgencyDeluxePartnerToken(directusClient, agencyId);
                    dispatch(updateAgency({ deluxePartnerToken: token }));
                } catch (err) {
                    console.error(err);
                }
            }
        }
        fetchToken();
    }, [deluxeToken, agencyId, directusClient, dispatch]);

    const handleResetClick = () => {
        dispatch(resetQuote());
        navigate('/agency/quote/bill-type');
    };

    const handleNextClick = () => {
        navigate('/agency/quote/customer-info');
    };

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.event === 'deluxe_success') {
                sessionStorage.setItem('deluxeData', JSON.stringify(e.data.payload));
                alert('Payment method added successfully');
                setIsPaymentAdded(true);
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
      window.parent.postMessage({event:'deluxe_success', payload:data}, '*');
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
            <Col span={24}>
                <iframe
                    title="Deluxe Payment"
                    srcDoc={iframeDoc}
                    style={{ width: '100%', border: 'none', height: '700px' }}
                />
            </Col>
            <Col span={24} style={{ marginTop: '32px' }}>
                <Row gutter={[40, 0]} justify={'center'}>
                    <Col>
                        <SubmitButton danger onClick={handleResetClick}>Start Over</SubmitButton>
                    </Col>
                    <Col>
                        {/*<SubmitButton icon={<LuArrowRight />} onClick={handleNextClick} disabled={!isPaymentAdded}>Next</SubmitButton>*/}
                        <SubmitButton icon={<LuArrowRight />} onClick={handleNextClick}>Next</SubmitButton>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default DeluxePayment;
