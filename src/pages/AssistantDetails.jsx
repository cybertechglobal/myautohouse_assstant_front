import {
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';

import { useParams, useNavigate } from 'react-router-dom';
import useCustomQuery from '../hooks/useCustomQuery';
import { getAssistant } from '../api/assistants';

export default function AssistantDetails() {
  const { companyId, assistantId } = useParams();
  const navigate = useNavigate();

  const { data: assistant, isLoading, isError } = useCustomQuery({
    queryKey: ['assistant', companyId, assistantId],
    queryFn: () => getAssistant({ companyId, assistantId }),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !assistant) {
    return (
      <Box p={4}>
        <Typography color="error">Failed to load assistant.</Typography>
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mt: 2 }}>
          Back
        </Button>
      </Box>
    );
  }

  const {
    name,
    gender,
    languages = [],
    voices = [],
    use_tts,
    virtual_office,
    data_collections = [],
    system_prompt,
    icon_url,
  } = assistant;

  const voice = voices[0] || {};

  return (
    <Paper sx={{ p: 4 }}>
      <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
        Back
      </Button>

      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar src={icon_url} sx={{ width: 100, height: 100 }} />
        <Box>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="subtitle1">Gender: {gender || 'N/A'}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Voice</Typography>
      <Typography>{voice.displayName || voice.name || 'N/A'}</Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Supported Languages
      </Typography>
      <Typography>{languages.join(', ') || 'N/A'}</Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Text-to-Speech
      </Typography>
      <Typography>{use_tts ? 'Enabled' : 'Disabled'}</Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Virtual Office
      </Typography>
      <Typography>{virtual_office?.name || 'None'}</Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Data Collections
      </Typography>
      {data_collections.length > 0 ? (
        data_collections.map((dc) => (
          <Typography key={dc.id}>
            {dc.name} — {dc.published ? 'Published' : 'Draft'}
          </Typography>
        ))
      ) : (
        <Typography>No data collections.</Typography>
      )}

      <Typography variant="h6" sx={{ mt: 2 }}>
        System Prompt
      </Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
        {system_prompt || 'N/A'}
      </Typography>
    </Paper>
  );
}
