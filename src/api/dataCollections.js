import { api } from './axios';

export async function createDataCollection(companyId, data) {
  const res = await api.post(`/companies/${companyId}/data-collections`, data);
  return res.data;
}

export async function getDataCollections(companyId) {
  const res = await api.get(`/companies/${companyId}/data-collections`);
  return res.data;
}

export async function getDataCollection(companyId, dataCollectionId) {
  const res = await api.get(
    `/companies/${companyId}/data-collections/${dataCollectionId}`
  );
  return res.data;
}

export async function updateDataCollection(companyId, dataCollectionId, data) {
  const res = await api.patch(
    `/companies/${companyId}/data-collections/${dataCollectionId}`,
    data
  );
  return res.data;
}

export async function deleteDataCollection(companyId, id) {
  const res = await api.delete(
    `/companies/${companyId}/data-collections/${id}`
  );
  return res.data;
}

export async function getDataCollectionEntries(companyId, id) {
  const res = await api.get(
    `/companies/${companyId}/data-collections/${id}/entries`
  );
  return res.data;
}

export async function addDataCollectionEntry(
  companyId,
  dataCollectionId,
  entryData
) {
  const res = await api.post(
    `/companies/${companyId}/data-collections/${dataCollectionId}/entries`,
    entryData
  );
  return res.data;
}

export async function deleteDataCollectionEntry({
  companyId,
  dataCollectionId,
  entryId,
}) {
  const res = await api.delete(
    `/companies/${companyId}/data-collections/${dataCollectionId}/entries/${entryId}`
  );
  return res.data;
}

export async function exportDataCollection(companyId, collectionDataId) {
  const res = await api.get(
    `/companies/${companyId}/data-collections/${collectionDataId}/export`,
    {
      responseType: 'blob',
      params: {
        format: 'csv',
      },
    }
  );
  return res;
}

export async function publishDataCollection(companyId, collectionDataId) {
  const res = await api.patch(
    `/companies/${companyId}/data-collections/${collectionDataId}/publish`
  );
  return res.data;
}

export async function importDataCollection(companyId, collectionDataId, data) {
  const res = await api.post(
    `/companies/${companyId}/data-collections/${collectionDataId}/import`,
    data
  );
  return res.data;
}
