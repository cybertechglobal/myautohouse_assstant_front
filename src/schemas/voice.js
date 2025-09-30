import * as Yup from 'yup';

export const voiceSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name should be at least 2 characters')
    .max(50, 'Name should not exceed 50 characters'),
  language: Yup.string().required('Language is required'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Gender must be "male" or "female"'),
  pitch: Yup.number()
    .required('Pitch is required')
    .min(-10, 'Pitch cannot be less than -10')
    .max(10, 'Pitch cannot be more than 10'),
  speaking_rate: Yup.number()
    .required('Speaking rate is required')
    .min(0.5, 'Speaking rate cannot be less than 0.5')
    .max(2, 'Speaking rate cannot be more than 2'),
});
