import { api } from './axios';

export const getConversations = async ({ page, limit, id, user_id, company_id, assistant_id, sort_by, sort_order }) => {
  const res = await api.get('/conversations', {
    params: {
      page,
      limit,
      id,
      user_id,
      company_id,
      assistant_id,
      sort_by,
      sort_order,
    }
  });
  return res.data;
};

export async function createConversation(data) {
  const res = await api.post('/conversations', data);
  return res.data;
}

export async function updateConversation(id, data) {
  const res = await api.patch(`/conversations/${id}`, data);
  return res.data;
}

export async function deleteConversation(id) {
  const res = await api.delete(`/conversations/${id}`);
  return res.data;
}
