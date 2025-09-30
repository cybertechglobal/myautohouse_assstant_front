import { api } from './axios';

export const getFeatures = async () => {
  const res = await api.get('/features');
  return res.data;
};

export async function createFeature(data) {
  const res = await api.post('/features', data);
  return res.data;
}

export async function updateFeature({ featureId, data }) {
  const res = await api.patch(`/features/${featureId}`, data);
  return res.data;
}

export async function deleteFeature(featureId) {
  const res = await api.delete(`/features/${featureId}`);
  return res.data;
}
