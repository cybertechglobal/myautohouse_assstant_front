import * as Yup from 'yup';

export const featureSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name should be at least 2 characters')
    .max(50, 'Name should not exceed 50 characters'),
});

export const companyFeatureSchema = Yup.object().shape({
  feature_id: Yup.string()
    .uuid('Feature ID must be a valid UUID')
    .required('Feature ID is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be a positive number'),
  billing_type: Yup.string()
    .oneOf(['prepaid', 'postpaid'], 'Billing type must be prepaid or postpaid')
    .required('Billing type is required'),
  prepaid_amount: Yup.number().when('billing_type', {
    is: 'prepaid',
    then: (s) => s.required('Amount is required'),
    otherwise: (s) => s.notRequired(),
  }),
});
