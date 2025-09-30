import { useMutation } from '@tanstack/react-query';
import { api } from '../api/axios';
import getErrorMessage from '../helpers/utils/errors';
import { notifyError } from '../helpers/utils/notify';

const defaultMutationFn = async ({ endpoint, data }) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

const useCustomMutation = ({ mutationFn = defaultMutationFn, ...options }) => {
  return useMutation({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        const { response } = error;
        let customError;

        if (response) {
          const { status, data } = response;
          const errorCode = data?.errorCode || data?.code;
          const fallbackMessage =
            typeof data?.message === 'string' ? data.message : '';
          const message = getErrorMessage(status, errorCode, fallbackMessage);

          customError = {
            status,
            errorCode,
            message,
            originalError: error,
          };
        } else {
          customError = {
            status: null,
            errorCode: null,
            message: 'Network or server error',
            originalError: error,
          };
        }

        if (!error.handledGlobally) {
          setTimeout(() => {
            notifyError(customError.message);
          });
        }

        throw customError;
      }
    },
    ...options,
  });
};

export default useCustomMutation;
