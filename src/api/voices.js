import { api } from './axios';

export const getVoices = async () => {
  const res = await api.get('/voices');
  return res.data;
};

export async function createVoice(data) {
  const res = await api.post('/voices', data);
  return res.data;
}

export async function updateVoice({ voiceId, body }) {
  const res = await api.patch(`/voices/${voiceId}`, body);
  return res.data;
}

export async function deleteVoice(voiceId) {
  const res = await api.delete(`/voices/${voiceId}`);
  return res.data;
}

export const getVoiceById = async (voiceId) => {
  const response = await api.get(`/voices/${voiceId}`);
  return response.data;
};
