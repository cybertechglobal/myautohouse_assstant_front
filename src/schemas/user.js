import * as yup from 'yup';

export const getUserSchema = (editMode = false) =>
  yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: editMode
      ? yup.string()
      : yup
          .string()
          .required('Password is required')
          .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
            'Password must be at least 8 characters long, contain one uppercase letter and one special character'
          ),
    confirm_password: yup.string().when('password', (password, schema) => {
      if (password) {
        return schema
          .required('Please confirm your password')
          .oneOf([yup.ref('password')], 'Passwords must match');
      }
      return schema;
    }),
  });
