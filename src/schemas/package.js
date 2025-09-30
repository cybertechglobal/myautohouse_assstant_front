import * as Yup from 'yup';

export const packageSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name should be at least 2 characters')
    .max(50, 'Name should not exceed 50 characters')
});
