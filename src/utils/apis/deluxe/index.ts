export const patchDeluxeCustomer = async (
    partnerToken: string,
    customerId: string,
    data: Record<string, unknown>,
    authToken?: string,
    baseUrl = 'https://sandbox.api.deluxe.com/dpp/v1/gateway/customers'
) => {
    const headers: Record<string, string> = {
        'PartnerToken': partnerToken,
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = authToken;
    }
    const res = await fetch(`${baseUrl}/${customerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error(`Deluxe PATCH failed with status ${res.status}`);
    }
    return res.json();
};

export const getDeluxeCustomer = async (
    partnerToken: string,
    customerId: string,
    authToken?: string,
    baseUrl = 'https://api.deluxe.com/dpp/v1/gateway/customers'
) => {
    const headers: Record<string, string> = {
        'PartnerToken': partnerToken,
    };
    if (authToken) {
        headers['Authorization'] = authToken;
    }
    const res = await fetch(`${baseUrl}/${customerId}`, {
        method: 'GET',
        headers,
    });
    if (!res.ok) {
        throw new Error(`Deluxe GET failed with status ${res.status}`);
    }
    return res.json();
};
