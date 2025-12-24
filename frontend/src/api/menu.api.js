import client from './client';

export const getMenus = (params = {}) => client.get('/menus', { params });
export const getMenuBySlug = (slug) => client.get(`/menus/${slug}`);
export const createMenu = (data) => client.post('/menus', data);
export const updateMenu = (slug, data) => client.put(`/menus/${slug}`, data);
export const deleteMenu = (slug) => client.delete(`/menus/${slug}`);
