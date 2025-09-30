import * as yup from 'yup';

export const companyGroupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().nullable(),
  country: yup.string().required('Country is required'),
  city: yup.string().nullable(),
  address: yup.string().nullable(),
  postalCode: yup.string().nullable(),
  contact_email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  contact_phone: yup.string().nullable(),
});
