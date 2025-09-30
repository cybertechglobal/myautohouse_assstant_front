import * as Yup from 'yup';

export const virtualOfficeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});