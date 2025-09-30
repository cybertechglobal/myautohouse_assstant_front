import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryClient } from '@tanstack/react-query';
import { getFeatures, deleteFeature } from '../api/features';
import AddEditFeatureModal from '../components/features/AddEditFeatureModal';
import SectionHeader from '../components/common/page-header/SectionHeader';
import useCustomQuery from '../hooks/useCustomQuery';
import useCustomMutation from '../hooks/useCustomMutation';
import DeleteDialog from '../components/common/delete-dialog/DeleteDialog';
import Loading from '../components/common/loading/loading';
import { notifySuccess } from '../helpers/utils/notify';

export default function Features() {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFeature, setSelectedFeature] = React.useState(null);

  const { data: features, isLoading } = useCustomQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
  });

  const deleteMutation = useCustomMutation({
    mutationFn: deleteFeature,
    onSuccess: () => {
      queryClient.invalidateQueries(['features']);
      setDeleteConfirmOpen(false);
      setSelectedPackage(null);
      notifySuccess('Feature deleted successfully');
    },
  });

  const handleAdd = () => {
    setEditMode(false);
    setSelectedFeature(null);
    setOpen(true);
  };

  const handleEdit = (feature) => {
    setEditMode(true);
    setSelectedFeature(feature);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedFeature.id);
  };

  const handleMenuClick = (e, feature) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedFeature(feature);
  };

  const handleModalClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedFeature(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box p={4}>
      <SectionHeader
        title="Features"
        buttonText="Add Feature"
        onButtonClick={handleAdd}
      />

      {features?.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography color="text.secondary">No features found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {features?.map((feature) => (
            <Grid key={feature.id} size={{ xs: 6, md: 8, lg: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Typography variant="h6">{feature.name}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body1" color="text.primary">
                      <strong>Description:</strong> {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {/*<Button
                    size="small"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(feature)}
                  >
                    Edit
                  </Button>
                    <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setSelectedFeature(feature);
                      setDeleteConfirmOpen(true); 
                    }}
                  >
                    Delete
                  </Button>*/}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AddEditFeatureModal
        open={open}
        editMode={editMode}
        defaultValues={selectedFeature || {}}
        onClose={handleModalClose}
        isSaving={deleteMutation.isPending}
      />

      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={'Delete Feature'}
        content={
          'Are you sure you want to delete this feature? This action cannot be undone.'
        }
      />
    </Box>
  );
}
