import client from './client';

export const getOrders = async () => {
    const response = await client.get('/orders');
    return response.data;
};

export const getOrderDetails = async (uuid) => {
    const response = await client.get(`/orders/${uuid}`);
    return response.data;
};

export const updateOrderStatus = async (uuid, status) => {
    const response = await client.put(`/orders/${uuid}/status`, { status });
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await client.post('/orders', orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await client.get('/orders/my');
    return response.data;
};

export const getMyOrderDetails = async (uuid) => {
    const response = await client.get(`/orders/my/${uuid}`);
    return response.data;
};
