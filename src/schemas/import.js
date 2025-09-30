import * as yup from 'yup';

export const importSchema = yup.object().shape({
  type: yup.string().oneOf(['api', 'file']).required(),

  url: yup.string().when('type', {
    is: 'api',
    then: (s) => s.required('URL is required').url('Invalid URL'),
    otherwise: (s) => s.notRequired(),
  }),

  method: yup.string().when('type', {
    is: 'api',
    then: (s) => s.required('Method is required'),
    otherwise: (s) => s.notRequired(),
  }),

  headers: yup.array().of(
    yup.object().shape({
      key: yup.string().when('type', {
        is: 'api',
        then: (s) => s.required('Key required'),
        otherwise: (s) => s.notRequired(),
      }),
      value: yup.string().when('type', {
        is: 'api',
        then: (s) => s.required('Value required'),
        otherwise: (s) => s.notRequired(),
      }),
    })
  ),

  payloadProperty: yup.string().notRequired(),

  file: yup.mixed().when('type', {
    is: 'file',
    then: (s) =>
      s
        .test('required', 'File is required', (value) => value instanceof File)
        .required(),
    otherwise: (s) => s.notRequired(),
  }),
});

// ⬇️ Backup: An old scheme that supports both text and file as input.
/* export const importSchema = yup
  .object()
  .shape({
    type: yup.string().oneOf(['api', 'upload', 'webhook']).required(),

    url: yup.string().when('type', {
      is: 'api',
      then: (s) => s.required('URL is required').url('Invalid URL'),
      otherwise: (s) => s.notRequired(),
    }),

    method: yup.string().when('type', {
      is: 'api',
      then: (s) => s.required('Method is required'),
      otherwise: (s) => s.notRequired(),
    }),

    headers: yup.array().of(
      yup.object().shape({
        key: yup.string().when('type', {
          is: 'api',
          then: (s) => s.required('Key required'),
          otherwise: (s) => s.notRequired(),
        }),
        value: yup.string().when('type', {
          is: 'api',
          then: (s) => s.required('Value required'),
          otherwise: (s) => s.notRequired(),
        }),
      })
    ),

    payloadProperty: yup.string().notRequired(),

    file: yup.mixed().nullable(true).notRequired(),
    text: yup.string().nullable(true).notRequired(),
  })
  .test('file-or-text-required', null, function (value) {
    const { path, createError } = this;

    if (value.type === 'upload') {
      const hasFile = value.file instanceof File;
      const hasText =
        typeof value.text === 'string' && value.text.trim().length > 0;

      if (!hasFile && !hasText) {
        return createError({
          path: 'file',
          message: 'Either file or text is required',
        });
      }
    }

    return true;
  });*/
