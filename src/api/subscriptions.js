import { api } from './axios';

export async function getSubscriptions(companyId) {
  const res = await api.get(`/subscriptions`, { params: { companyId } });
  return res.data;
}

export async function createSubscription(data) {
  const res = await api.post(`/subscriptions`, data);
  return res.data;
}

export async function updateSubscription({ subscriptionId, data }) {
  const res = await api.patch(`/subscriptions/${subscriptionId}`, data);
  return res.data;
}

export async function deleteSubscription(subscriptionId) {
  const res = await api.delete(`/subscriptions/${subscriptionId}`);
  return res.data;
}
