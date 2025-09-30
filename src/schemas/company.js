import * as yup from 'yup';

export const companySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value?.trim() === '' ? null : value))
    .test(
      'is-valid-phone',
      'Phone number must be in international format and 8–15 digits long (e.g. +381641234567)',
      (value) => {
        if (!value) return true; // skip if null/empty
        const digitsOnly = value.replace(/[^0-9]/g, '');
        return /^\+?[1-9]\d{7,14}$/.test(value) && digitsOnly.length >= 8;
      }
    ),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  country: yup.string().nullable(),
  postal_code: yup.string().nullable(),
  website: yup.string().nullable(),
  description: yup.string().nullable(),
  company_group_id: yup.string().nullable(),
  logo: yup.mixed().nullable(),
});
