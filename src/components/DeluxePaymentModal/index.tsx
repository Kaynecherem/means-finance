import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from '../CustomModal';
import { useDirectUs } from '../DirectUs/DirectusContext';
import { getAgencyDeluxePartnerToken, updateProfile } from '../../utils/apis/directus';
import { updateAgency } from '../../utils/redux/slices/authSlice';
import { RootState } from '../../utils/redux/store';

const DeluxePaymentModal: React.FC<{
    open?: boolean;
    onClose?: () => void;
    onPaymentAdd?: () => void;
    xpm?: number;
}> = ({ open, onClose, onPaymentAdd, xpm = 0 }) => {
    const dispatch = useDispatch();
    const { directusClient } = useDirectUs();
    const deluxeToken = useSelector(({ auth }: RootState) => auth.agency?.deluxePartnerToken);
    const agencyId = useSelector(({ auth }: RootState) => auth.agency?.id);

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
        };
        if (open) {
            fetchToken();
        }
    }, [open, deluxeToken, agencyId, directusClient, dispatch]);

    useEffect(() => {
        const handleMessage = async (e: MessageEvent) => {
            const data = e.data as any;
            const isVaultMessage = data && typeof data === 'object' && data.type === 'Vault';
            const isSuccessEvent = data && typeof data === 'object' && data.event === 'deluxe_success';

            if (isSuccessEvent || isVaultMessage) {
                const payload = isVaultMessage
                    ? { customerId: data.data?.customerId, vaultId: data.data?.vaultId }
                    : data.payload;
                sessionStorage.setItem('deluxeData', JSON.stringify(payload));
                try {
                    await updateProfile(directusClient, {
                        deluxe_customer_id: payload?.data?.customerId,
                        deluxe_vault_id: payload?.data?.vaultId,
                    });
                } catch (err) {
                    console.error(err);
                }
                if (onPaymentAdd) {
                    onPaymentAdd();
                }
                if (onClose) {
                    onClose();
                }
            }
        };
        if (open) {
            window.addEventListener('message', handleMessage);
        }
        return () => window.removeEventListener('message', handleMessage);
    }, [open, onClose, onPaymentAdd, directusClient]);

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
    xpm: "${xpm}",
    xcssid: "mycustomcss"
  };

  HostedForm.init(options, {
    onSuccess: function(data) {
      window.parent.postMessage({event:'deluxe_success', payload:data}, '*');
    },
    onFailure: function(data) { console.log(JSON.stringify(data)); },
    onInvalid: function(data) { console.log(JSON.stringify(data)); }
  }).then(function(instance) { instance.renderHpf(); });
</script>
</body>
</html>`;
    }, [deluxeToken, xpm]);

    return (
        <CustomModal
            title="Add Payment Method"
            open={open}
            onCancel={onClose}
            onClose={onClose}
            footer={false}
            width={700}
        >
            <iframe
                title="Deluxe Payment"
                srcDoc={iframeDoc}
                style={{ width: '100%', border: 'none', height: '700px' }}
            />
        </CustomModal>
    );
};

export default DeluxePaymentModal;
