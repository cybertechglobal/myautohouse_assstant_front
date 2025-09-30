import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useCustomMutation from '../../hooks/useCustomMutation';

import { yupResolver } from '@hookform/resolvers/yup';
import { importSchema } from '../../schemas/import';
import { notifySuccess } from '../../helpers/utils/notify';
import DialogHeader from '../common/dialog-header/DialogHeader';
import { importDataCollection } from '../../api/dataCollections';

export default function ImportDataCollectionDialog({
  open,
  onClose,
  collectionId,
  companyId,
  webhookToken,
}) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      type: 'api',
      url: '',
      method: '',
      headers: [{ key: '', value: '' }],
      payloadProperty: '',
      file: null,
    },
    resolver: yupResolver(importSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });
  const type = watch('type');

  useEffect(() => {
    if (!open) {
      reset({
        type: 'api',
        url: '',
        method: '',
        headers: [{ key: '', value: '' }],
        payloadProperty: '',
        file: null,
      });
    }
  }, [open, reset]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file);
    }
  };

  const importMutation = useCustomMutation({
    mutationFn: async ({ importData }) => {
      if (importData instanceof FormData) {
        return importDataCollection(companyId, collectionId, importData);
      }

      if (importData.type === 'api') {
        const body = {
          url: importData.url,
          method: importData.method,
          headers: importData.headers,
          payloadProperty: importData.payloadProperty || '',
        };
        return importDataCollection(companyId, collectionId, body);
      }

      /*if (importData.type === 'text') {
        return importDataCollection(companyId, collectionId, {
          type: 'text',
          text: importData.text,
        });
      }*/

      throw new Error('Unsupported import type');
    },
  });

  const onSubmit = async (formData) => {
    let importData = {};

    if (formData.type === 'api') {
      const headersObject = formData.headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {});

      importData = {
        type: 'api',
        url: formData.url,
        method: formData.method,
        headers: [headersObject],
        payloadProperty: formData.payloadProperty,
      };

      try {
        await importMutation.mutateAsync({ collectionId, importData });
        notifySuccess('Import successful');
        onClose();
      } catch (error) {
        console.error('Import failed:', error);
      }
    } else if (formData.type === 'file') {
      const fileFormData = new FormData();
      fileFormData.append('type', 'csv');
      fileFormData.append('file', formData.file);
      try {
        await importMutation.mutateAsync({ collectionId, importData: fileFormData });
        notifySuccess('Import successful');
        onClose();
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
    /*else if (type === 'upload') {
       const hasFile = !!formData.file;
       const hasText = formData.text?.trim().length > 0;
  
       if (!hasFile && !hasText) {
         notifyError('Please provide either file or text.');
         return;
       }
  
       const results = [];
  
       if (hasFile) {
         const fileFormData = new FormData();
         fileFormData.append('type', 'doc');
         fileFormData.append('file', formData.file);
  
         const result = await importMutation.mutateAsync({ importData: fileFormData });
         results.push(result);
       }
  
       if (hasText) {
         const result = await importMutation.mutateAsync({
           importData: {
             type: 'text',
             text: formData.text,
           },
         });
         results.push(result);
       }
  
       notifySuccess('Import successful');
       onClose();
     }*/
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogHeader title="Import Data Collection" onClose={onClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography variant="subtitle1" mt={2}>
            Type
          </Typography>
          <RadioGroup
            row
            aria-labelledby="type-group"
            value={type}
            onChange={(e) => setValue('type', e.target.value)}
          >
            <FormControlLabel value="api" control={<Radio />} label="API" />
            <FormControlLabel value="file" control={<Radio />} label="CSV" />
            <FormControlLabel value="webhook" control={<Radio />} label="Webhook" />
            {/*<FormControlLabel value="upload" control={<Radio />} label="Doc/Text" />*/}
          </RadioGroup>

          {type === 'api' && (
            <>
              <TextField
                label="URL"
                fullWidth
                margin="normal"
                size="small"
                defaultValue=""
                {...register('url')}
                error={!!errors.url}
                helperText={errors.url?.message}
              />
              <TextField
                label="Method"
                fullWidth
                margin="normal"
                size="small"
                defaultValue=""
                {...register('method')}
                error={!!errors.method}
                helperText={errors.method?.message}
              />
              <Typography variant="subtitle1" mt={2}>
                Headers
              </Typography>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  display="flex"
                  gap={1}
                  alignItems="center"
                  mb={1}
                >
                  <TextField
                    label="Header Key"
                    fullWidth
                    size="small"
                    defaultValue={field.key}
                    {...register(`headers.${index}.key`)}
                  />
                  <TextField
                    label="Header Value"
                    fullWidth
                    size="small"
                    defaultValue={field.value}
                    {...register(`headers.${index}.value`)}
                  />
                  <IconButton onClick={() => remove(index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={() => append({ key: '', value: '' })}
                variant="text"
                size="small"
              >
                + Add Header
              </Button>
              <TextField
                label="Payload Property"
                fullWidth
                margin="normal"
                size="small"
                defaultValue=""
                {...register('payloadProperty')}
              />
            </>
          )}

          {type === 'file' && (
            <Box mt={2}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap={1}
              >
                <Button variant="outlined" color='inherit' component="label" size="small">
                  Choose File
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>

                <Typography variant="body2">
                  {watch('file')?.name || 'No file chosen'}
                </Typography>

                {errors.file && (
                  <Typography variant="caption" color="error">
                    {errors.file.message}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/*type === 'upload' && (
            <>
              <Box mt={2}>
                <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
                  <Button variant="outlined" color="inherit" component="label" size="small">
                    Choose File
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>

                  <Typography variant="body2">
                    {watch('file')?.name || 'No file chosen'}
                  </Typography>
                </Box>
              </Box>

              <Box mt={2}>
                <TextField
                  label="Text"
                  fullWidth
                  multiline
                  rows={8}
                  margin="normal"
                  size="small"
                  {...register('text')}
                  error={!!errors.text || !!errors?.['']}
                  helperText={
                    errors.text?.message ||
                    errors?.['']?.message
                  }
                  onChange={async (e) => {
                    setValue('text', e.target.value);
                    await trigger(['file', 'text']);
                  }}
                />
              </Box>

              {errors.file?.message && (
                <Typography variant="caption" color="error">
                  {errors.file.message}
                </Typography>
              )}
            </>
          )*/}


          {type === 'webhook' && (
            <Box
              mt={3}
              display="flex"
              flexDirection="column"
              alignItems="start"
              gap={1}
            >
              <Typography variant="body1" fontWeight="bold">
                Webhook Token:
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  wordBreak: 'break-all',
                  p: 1,
                  bgcolor: '#f0f0f0',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  {webhookToken || 'No token available'}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    navigator.clipboard.writeText(webhookToken || '');
                    notifySuccess('Token copied to clipboard');
                  }}
                  startIcon={<ContentCopyIcon />}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          <DialogActions>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            {type !== 'webhook' && (
              <Button type="submit" variant="contained">
                Import
              </Button>
            )}
          </DialogActions>
        </DialogContent>

      </form>
    </Dialog>
  );
}
