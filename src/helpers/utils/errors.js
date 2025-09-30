const getErrorMessage = (status, errorCode, fallbackMessage = '') => {
  const errorMap = {
    409: {
    },
    400: {
      4000019: 'User with entered email already exist.',
    },
    401: {
    },
    403: {
      4030003: 'Invalid credentials provided.',
      4030004: 'Wrong email or password.',
      4030010: 'Not enough credits.',
    },
    404: 'The requested resource could not be found.',
    500: 'Internal Server Error: Something went wrong on our end.',
  };

  if (errorMap[status]) {
    if (typeof errorMap[status] === 'object') {
      return (
        errorMap[status][errorCode] ||
        fallbackMessage ||
        `(${status}-${errorCode}) Unknown error occurred.`
      );
    }
    return errorMap[status];
  }

  return (
    fallbackMessage || 'An unexpected error occurred. Please try again later.'
  );
};

export default getErrorMessage;
