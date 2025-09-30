import { api } from './axios';

export const getAssistants = async (companyId) => {
  const res = await api.get(`companies/${companyId}/assistants`);
  return res.data;
};

export async function createAssistant({ companyId, data }) {
  const res = await api.post(`companies/${companyId}/assistants`, data);
  return res.data;
}

export const getAssistant = async ({companyId, assistantId}) => {
  const res = await api.get(`companies/${companyId}/assistants/${assistantId}`);
  return res.data;
};

export async function updateAssistant({ companyId, assistantId, data }) {
  const res = await api.patch(
    `/companies/${companyId}/assistants/${assistantId}`,
    data
  );
  return res.data;
}

export async function deleteAssistant({ companyId, assistantId }) {
  const res = await api.delete(`/companies/${companyId}/assistants/${assistantId}`);
  return res.data;
}

export async function uploadAssistantIcon({ companyId, assistantId, file }) {
  const formData = new FormData();
  formData.append('icon', file);

  const res = await api.post(
    `/companies/${companyId}/assistants/${assistantId}/icons`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
}

export async function getVoices({ companyId, assistantId }) {
  const res = await api.get(
    `/companies/${companyId}/assistants/${assistantId}/voices`
  );
  return res.data;
}

export async function addVoiceToAssistant({ companyId, assistantId, voiceId }) {
  const res = await api.post(
    `/companies/${companyId}/assistants/${assistantId}/voices`,
    {
      voiceId,
    }
  );
  return res.data;
}

export async function removeVoiceFromAssistant({ companyId, assistantId, voiceId }) {
  const res = await api.delete(
    `/companies/${companyId}/assistants/${assistantId}/voices/${voiceId}`
  );
  return res.data;
}

export async function addDataCollectionToAssistant({ companyId, assistantId, data_collection_id }) {
  const res = await api.post(
    `/companies/${companyId}/assistants/${assistantId}/data-collections`,
    {
      data_collection_id,
    }
  );
  return res.data;
}

export async function removeDataCollectionFromAssistant({ companyId, assistantId, data_collection_id }) {
  const res = await api.delete(
    `/companies/${companyId}/assistants/${assistantId}/data-collections/${data_collection_id}`
  );
  return res.data;
}
