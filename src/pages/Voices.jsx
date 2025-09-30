import React from 'react';

import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVoices,
  createVoice,
  deleteVoice,
  updateVoice,
} from '../api/voices';
import AddEditVoiceModal from '../components/voices/AddEditVoiceDialog';
import SectionHeader from '../components/common/page-header/SectionHeader';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';

import DeleteDialog from '../components/common/delete-dialog/DeleteDialog';
import Loading from '../components/common/loading/loading';
import { notifySuccess } from '../helpers/utils/notify';

export default function Voices() {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedVoice, setSelectedVoice] = React.useState(null);

  const { data: voices, isLoading } = useCustomQuery({
    queryKey: ['voices'],
    queryFn: () => getVoices(),
  });

  const createMutation = useCustomMutation({
    mutationFn: createVoice,
    onSuccess: () => {
      queryClient.invalidateQueries(['voices']);
    },
  });

  const updateMutation = useCustomMutation({
    mutationFn: updateVoice,
    onSuccess: () => {
      queryClient.invalidateQueries(['voices']);
      notifySuccess('Voice successfully update');
    },
  });

  const deleteMutation = useCustomMutation({
    mutationFn: deleteVoice,
    onSuccess: () => {
      queryClient.invalidateQueries(['voices']);
      setDeleteConfirmOpen(false);
      setSelectedVoice(null);
      notifySuccess('Voice deleted successfully');
    },
  });

  const handleAdd = () => {
    setEditMode(false);
    setSelectedVoice(null);
    setOpen(true);
  };

  const handleEdit = (voice) => {
    setEditMode(true);
    setSelectedVoice(voice);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedVoice.id);
  };

  const handleMenuClick = (e, voice) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedVoice(voice);
  };

  const handleSubmit = async (formData) => {
    const { logo, ...rest } = formData;

    const cleanedData = Object.fromEntries(
      Object.entries(rest).filter(
        ([_, v]) => v !== '' && v !== undefined && v !== null
      )
    );

    try {
      let voice;
      if (editMode && selectedVoice?.id) {
        voice = await updateMutation.mutateAsync({
          voiceId: selectedVoice.id,
          body: cleanedData,
        });
      } else {
        voice = await createMutation.mutateAsync(cleanedData);
      }

      setOpen(false);
      setSelectedVoice(null);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box p={4}>
      <SectionHeader
        title="Voices"
        buttonText="Add Voice"
        onButtonClick={handleAdd}
      />

      {voices.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography color="text.secondary">No voices found.</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {voices?.map((voice) => (
              <Grid size={{ xs: 6, md: 8, lg: 3 }} key={voice.id}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                    >
                      <Typography variant="h6">{voice.name}</Typography>
                      <IconButton onClick={(e) => handleMenuClick(e, voice)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body1" color="text.primary">
                        <strong>Language:</strong> {voice.language}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        <strong>Gender:</strong> {voice.gender}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        <strong>Pitch:</strong> {voice.pitch}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        <strong>Speaking Rate:</strong> {voice.speaking_rate}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        <strong>Provider:</strong> {voice.provider}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <AddEditVoiceModal
        open={open}
        editMode={editMode}
        defaultValues={selectedVoice || {}}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setSelectedVoice(null);
        }}
        onSubmit={handleSubmit}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={'Delete voice'}
        content={
          'Are you sure you want to delete this voice? This action cannot be undone.'
        }
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(selectedVoice);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setDeleteConfirmOpen(true);
            setAnchorEl(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
