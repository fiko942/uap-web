import client from './client';

export const getUsers = async () => {
    const response = await client.get('/users');
    return response.data;
};

export const createUser = async (userData) => {
    const response = await client.post('/users', userData);
    return response.data;
};

export const updateUser = async (uuid, userData) => {
    const response = await client.put(`/users/${uuid}`, userData);
    return response.data;
};

export const deleteUser = async (uuid) => {
    const response = await client.delete(`/users/${uuid}`);
    return response.data;
};

export const banUser = async (uuid) => {
    const response = await client.put(`/users/${uuid}/ban`);
    return response.data;
};

export const unbanUser = async (uuid) => {
    const response = await client.put(`/users/${uuid}/unban`);
    return response.data;
};
