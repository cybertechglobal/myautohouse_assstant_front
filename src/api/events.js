import { api } from './axios';

export const getEventLogs = async (filters) => {
  const { data } = await api.get('/event-logs', { params: filters });
  return data;
};

/*
export const getEventLogs = async ({ page = 1, limit = 6 }) => {
  const validPage = 1; // page mora biti > 0
  const validLimit = 6; // limit mora biti > 0
  const params = {
    page: Number(params.page),
    limit: Number(params.limit),
  };
  const { data } = await api.get('/event-logs', { params: params });
  return data;
};*/
