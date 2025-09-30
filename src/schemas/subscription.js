import * as yup from 'yup';

export const subscriptionSchema = yup.object().shape({
  start_date: yup.date().required('Start date is required'),
  end_date: yup
    .date()
    .min(yup.ref('start_date'), 'End date must be after start date'),
  type: yup
    .string()
    .oneOf(['basic', 'premium'], 'Invalid type')
    .required('Type is required'),
  package_id: yup.string().required('Package is required'),
});
