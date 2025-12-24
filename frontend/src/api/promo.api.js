import client from './client';

export const getPromos = async (all = false) => {
    const response = await client.get(`/promos${all ? '?all=true' : ''}`);
    return response.data;
};

export const getPromo = async (uuid) => {
    const response = await client.get(`/promos/${uuid}`);
    return response.data;
};

export const createPromo = async (promoData) => {
    const response = await client.post('/promos', promoData);
    return response.data;
};

export const updatePromo = async (uuid, promoData) => {
    const response = await client.put(`/promos/${uuid}`, promoData);
    return response.data;
};

export const deletePromo = async (uuid) => {
    const response = await client.delete(`/promos/${uuid}`);
    return response.data;
};

export const assignPromoToMenus = async (uuid, menuIds) => {
    const response = await client.put(`/promos/${uuid}/assign-menus`, { menu_ids: menuIds });
    return response.data;
};
