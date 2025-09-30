import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Box,
  Stack,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';

import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  createAssistant,
  updateAssistant,
  uploadAssistantIcon,
  addVoiceToAssistant,
  addDataCollectionToAssistant,
  removeDataCollectionFromAssistant,
  removeVoiceFromAssistant
} from '../../api/assistants';

import { Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import useCustomQuery from '../../hooks/useCustomQuery';
import useCustomMutation from '../../hooks/useCustomMutation';
import { getVirtualOffices } from '../../api/virtualOffices';
import { getDataCollections } from '../../api/dataCollections';
import DialogHeader from '../common/dialog-header/DialogHeader';
import { notifySuccess } from '../../helpers/utils/notify';

import { PERSONALITIES } from '../../helpers/consts/personalities';
import { useAuthStore } from '../../store/authStore';

import { getSubscriptions } from '../../api/subscriptions';

export default function AssistantForm({ open, onClose, assistant, companyId, allAssistants = [] }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { user } = useAuthStore();
  const isRoot = user?.role === 'root';

  const SUPPORTED_LANGUAGES = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Spanish', value: 'es' },
    { label: 'Serbian', value: 'sr' },
    { label: 'Croatian', value: 'hr' },
    { label: 'Slovenian', value: 'sl' },
  ];

  const [useSpeech, setUseSpeech] = useState(false);
  const [avatar, setAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(false);

  const [selectedVoices, setSelectedVoices] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const queryClient = useQueryClient();

  const isEdit = Boolean(assistant);

  const mutation = useCustomMutation({
    mutationFn: ({ companyId, data, id }) =>
      isEdit
        ? updateAssistant({ companyId, assistantId: id, data })
        : createAssistant({ companyId, data }),
    onSuccess: async (result, variables) => {
      const assistantId = isEdit ? variables.id : result.id;

      if (avatar && typeof avatar !== 'string') {
        try {
          await uploadAssistantIcon({ companyId, assistantId, file: avatar });
        } catch (err) {
          console.error('Icon upload failed:', err);
        }
      }

      const newVoiceIds = Array.isArray(variables.voiceIds)
        ? variables.voiceIds
        : variables.voiceIds != null
          ? [variables.voiceIds]
          : [];
      const oldVoiceIds = assistant?.voices?.map((v) => v.id) || [];

      const voicesToAdd = newVoiceIds.filter((id) => !oldVoiceIds.includes(id));
      const voicesToRemove = oldVoiceIds.filter((id) => !newVoiceIds.includes(id));

      try {
        await Promise.all([
          ...voicesToAdd.map((voiceId) =>
            addVoiceToAssistant({ companyId, assistantId, voiceId })
          ),
          ...voicesToRemove.map((voiceId) =>
            removeVoiceFromAssistant({ companyId, assistantId, voiceId })
          ),
        ]);
      } catch (err) {
        console.error('Updating voices failed:', err);
      }

      const newDC = variables.dataCollectionId;
      const oldDC = assistant?.data_collection?.id;

      if (newDC && newDC !== oldDC) {
        try {
          await addDataCollectionToAssistant({
            companyId,
            assistantId,
            data_collection_id: newDC,
          });
        } catch (err) {
          console.error('Adding data collection failed:', err);
        }
      } else if (!newDC && oldDC) {
        try {
          await removeDataCollectionFromAssistant({
            companyId,
            assistantId,
            data_collection_id: oldDC,
          });
        } catch (err) {
          console.error('Removing data collection failed:', err);
        }
      }

      queryClient.invalidateQueries(['assistants', companyId]);
      onClose();
      notifySuccess(
        isEdit ? 'Assistant updated successfully' : 'Assistant created successfully'
      );
    },
  });

  const { data: virtualOffices = [], isLoading: voLoading } = useCustomQuery({
    queryKey: ['virtualOffices', companyId],
    queryFn: () => getVirtualOffices(companyId),
  });

  const { data: dataCollectionsResponse = {}, isLoading: dcLoading } =
    useCustomQuery({
      queryKey: ['dataCollections', companyId],
      queryFn: () => getDataCollections(companyId),
    });

  const dataCollections = dataCollectionsResponse.data || [];

  const selectedOffice =
    virtualOffices.find((v) => v.id === watch('virtual_office_id')) || null;

  const { data: voicesData, isLoading: voicesLoading } = useCustomQuery({
    queryKey: ['/voices', { companyId }],
  });

  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useCustomQuery({
    queryKey: ['subscriptions', companyId],
    queryFn: () => getSubscriptions(companyId),
    enabled: isRoot
  });

  useEffect(() => {
    if (assistant && voicesData?.length) {
      reset({
        name: assistant.name || null,
        personality: assistant.personality || null,
        supported_languages: assistant.supported_languages || ['en'],
        virtual_office_id: assistant.virtual_office_id || null,
        data_collection_id: assistant.data_collection?.id || null,
        user_message_limit: assistant.user_message_limit || null,
        subscription_id: assistant.subscription_id || null,
      });

      setUseSpeech(assistant.use_tts || false);

      if (assistant.icon_url) {
        setAvatarPreview(assistant.icon_url);
      } else {
        setAvatarPreview(null);
      }

      const matchedVoices = voicesData.filter((v) =>
        assistant.voices?.some((av) => av.id === v.id)
      );

      setSelectedVoices(matchedVoices);
      setSelectedLanguages(matchedVoices.map((v) => v.language));
    } else {
      reset({
        name: '',
        personality: null,
        voice: null,
        supported_languages: ['en'],
        user_message_limit: '',
      });
      setUseSpeech(false);
      setAvatar(null);
      setAvatarPreview(null);
    }
  }, [assistant, voicesData, reset]);

  useEffect(() => {
    if (!open) {
      reset();
      setAvatar(null);
      setAvatarPreview(null);
    }
  }, [open, reset]);

  const onSubmit = (data) => {

    const voiceIds = selectedVoices.map((v) => v.id);
    const dataCollectionId = data.data_collection_id;
    const subscriptionId = data.subscription_id;
    const payload = {
      ...data,
      voice: undefined,
      subscription_id: subscriptionId || null,
      data_collection_id: undefined,
      use_tts: useSpeech,
      virtual_office_id: data.virtual_office_id || null,
      user_message_limit: data.user_message_limit
        ? parseInt(data.user_message_limit, 10)
        : undefined,
    };

    mutation.mutate({
      companyId,
      ...(isEdit && { id: assistant.id }),
      data: payload,
      voiceIds,
      dataCollectionId,
    });
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');

  const assignedSubscriptionIds = allAssistants
    .filter(a => a.subscription_id && (!assistant || a.id !== assistant.id))
    .map(a => a.subscription_id);


  const availableSubscriptions = activeSubscriptions.filter(
    (sub) => !assignedSubscriptionIds.includes(sub.id)
  );

  useEffect(() => {
    if (!open) {
      setSelectedVoices([]);
      setSelectedLanguages([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={isEdit ? 'Edit Assistant' : 'Add Assistant'} onClose={onClose} />
        <DialogContent>
          <Box display="flex" justifyContent="center" mt={1}>
            <Box position="relative">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAvatarPreview(reader.result);
                    };
                    reader.readAsDataURL(file);

                    setAvatar(file);
                  }
                }}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    overflow: 'hidden',
                    position: 'relative',
                    p: 0,
                  }}
                >
                  {avatar || avatarPreview ? (
                    <Avatar
                      src={avatarPreview}
                      sx={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="100%"
                      height="100%"
                    >
                      <PhotoCameraIcon sx={{ color: '#aaa', fontSize: 32 }} />
                    </Box>
                  )}
                </IconButton>
              </label>
            </Box>
          </Box>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Autocomplete
              size="small"
              options={PERSONALITIES}
              getOptionLabel={(option) => option.label}
              value={PERSONALITIES.find((p) => p.value === watch('personality')) || null}
              onChange={(_, newValue) => setValue('personality', newValue?.value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Personality"
                  fullWidth
                  error={!!errors.personality}
                  helperText={errors.personality?.message}
                />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={useSpeech}
                  onChange={(e) => setUseSpeech(e.target.checked)}
                />
              }
              label="Use text-to-speech"
            />

            <Autocomplete
              multiple
              size="small"
              options={voicesData || []}
              getOptionLabel={(option) =>
                `${option.displayName || option.name} [${option.language.toUpperCase()} • ${capitalize(option.gender)}]`
              }
              value={selectedVoices}
              onChange={(_, newValue) => {
                const uniqueByLanguage = [];
                newValue.forEach((voice) => {
                  const exists = uniqueByLanguage.find((v) => v.language === voice.language);
                  if (!exists) {
                    uniqueByLanguage.push(voice);
                  } else {
                    const index = uniqueByLanguage.findIndex((v) => v.language === voice.language);
                    uniqueByLanguage[index] = voice;
                  }
                });

                setSelectedVoices(uniqueByLanguage);
                setSelectedLanguages(uniqueByLanguage.map((v) => v.language));
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Voices"
                  error={!!errors.voice}
                  helperText={errors.voice?.message}
                  fullWidth
                />
              )}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <li key={`${option.id}-${option.language}-${option.gender}`} {...rest}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={option.avatarUrl} sx={{ width: 50, height: 50, mr: 1 }} />
                      <span>{option.displayName || option.name}</span>
                    </Box>
                  </li>
                );
              }}
            />

            <Autocomplete
              size="small"
              options={virtualOffices}
              getOptionLabel={(option) => option.name || ''}
              value={selectedOffice}
              onChange={(_, newValue) =>
                setValue('virtual_office_id', newValue?.id || '')
              }
              disabled={voLoading}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Virtual Office"
                  placeholder="Select an office"
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box display="flex" alignItems="center">
                    {option.background_url ? (
                      <Avatar src={option.background_url} sx={{ width: 50, height: 50, mr: 1 }} />
                    ) : (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: '#f0f0f0',
                          mr: 1,
                        }}
                      />
                    )}
                    <span>{option.name}</span>
                  </Box>
                </li>
              )}
            />

            <Autocomplete
              size="small"
              options={dataCollections}
              getOptionLabel={(option) => option.name || ''}
              value={
                dataCollections.find(
                  (d) => d.id === watch('data_collection_id')
                ) || null
              }
              onChange={(_, newValue) =>
                setValue('data_collection_id', newValue?.id || '')
              }
              disabled={dcLoading}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Data Collection"
                  placeholder="Select a collection"
                  fullWidth
                />
              )}
            />

            <Autocomplete
              multiple
              size="small"
              options={SUPPORTED_LANGUAGES}
              getOptionLabel={(option) => option.label}
              value={
                SUPPORTED_LANGUAGES.filter((lang) =>
                  watch('supported_languages')?.includes(lang.value)
                )
              }
              onChange={(_, newValue) =>
                setValue('supported_languages', newValue.map((lang) => lang.value))
              }
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supported Languages"
                  fullWidth
                />
              )}
            />

            {isRoot && (
              <Autocomplete
                size="small"
                options={availableSubscriptions}
                getOptionLabel={(option) =>
                  `${option.package.name} (${option.package.conversations_limit} conversations - ${option.package.price} price)`
                }
                value={subscriptions.find((sub) => sub.id === watch('subscription_id')) || null}
                onChange={(_, newValue) => setValue('subscription_id', newValue?.id || '')}
                disabled={subscriptionsLoading}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subscription"
                    placeholder="Select a subscription"
                    fullWidth
                  />
                )}
              />
            )}

            {isRoot && (
              <TextField
                fullWidth
                size="small"
                label="User message limit"
                type="number"
                {...register('user_message_limit')}
              />
            )}

            {/*<TextField
              fullWidth
              size="small"
              label="System Prompt"
              placeholder="e.g. You are a helpful assistant..."
              {...register('system_prompt')}
              multiline
              minRows={3}
            />*/}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <DialogActions>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update'
                  : 'Create'}
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
}
