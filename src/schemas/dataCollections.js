import * as yup from 'yup';

export const dataCollectionsSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  tags: yup.array().of(yup.string()).default([]),
});
