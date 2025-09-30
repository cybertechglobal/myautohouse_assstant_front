import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';
import getErrorMessage from '../helpers/utils/errors';

import { notifyError } from '../helpers/utils/notify';

const defaultFetchData = async ({ queryKey }) => {
  const [endpoint, params] = queryKey;
  const { data } = await api.get(endpoint, { params });
  return data;
};

const useCustomQuery = ({
  queryKey,
  queryFn = defaultFetchData,
  disableGlobalError = false,
  ...options
}) => {
  return useQuery({
    queryKey,
    queryFn: async (context) => {
      try {
        return await queryFn(context);
      } catch (error) {
        if (!error.handledGlobally && !disableGlobalError) {
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

            setTimeout(() => {
              notifyError(message);
            });
          } else {
            const message = 'Network or server error';
            customError = {
              status: null,
              errorCode: null,
              message,
              originalError: error,
            };

            setTimeout(() => {
              notifyError(message);
            });
          }

          throw customError;
        }

        throw error;
      }
    },
    ...options,
  });
};

export default useCustomQuery;
