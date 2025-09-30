import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogContent,
  Grid,
  Tooltip
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CircularProgress from '@mui/material/CircularProgress'; // Add this to importsF

import { useQueryClient } from '@tanstack/react-query';

import useCustomQuery from '../../hooks/useCustomQuery';
import useCustomMutation from '../../hooks/useCustomMutation';
import { getVirtualOffices, deleteVirtualOffice } from '../../api/virtualOffices';
import VirtualOfficeForm from './VirtualOfficeForm';

import DeleteDialog from '../common/delete-dialog/DeleteDialog';
import { notifySuccess } from '../../helpers/utils/notify';
import Loading from '../common/loading/loading';
import SectionHeader from '../common/page-header/SectionHeader';
import NoData from '../common/no-data/NoData';
import { useAuthStore } from '../../store/authStore';

export default function VirtualOfficeList({ companyId }) {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState(null);

  const { user } = useAuthStore();
  const isRoot = user?.role === 'root';

  const hasAvatarsFeature = user?.company?.features.some(feature => feature.name === 'Avatars');

  const { data: offices = [], isLoading } = useCustomQuery({
    queryKey: ['virtualOffices', companyId],
    queryFn: () => getVirtualOffices(companyId),
  });

  const deleteMutation = useCustomMutation({
    mutationFn: ({ companyId, virtualOfficeId }) =>
      deleteVirtualOffice({ companyId, virtualOfficeId }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['virtualOffices', companyId], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((office) => office.id !== variables.virtualOfficeId);
      });
      notifySuccess('Virtual office deleted successfully');
      setDeleteDialogOpen(false);
      setOfficeToDelete(null);
    },
    onError: (error) => {
      console.error('Delete failed:', error);
    },
  });

  const handleAddClick = () => {
    setSelectedOffice(null);
    setOpenForm(true);
  };

  const handleEditClick = (office) => {
    setSelectedOffice(office);
    setOpenForm(true);
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };


  const handleDeleteClick = (office) => {
    setOfficeToDelete(office);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (officeToDelete) {
      deleteMutation.mutate({
        companyId,
        virtualOfficeId: officeToDelete.id,
      });
    }
  };


  return (
    <Box>
      <SectionHeader
        title="Virtual Offices"
        buttonText="Add Office"
        onButtonClick={isRoot && handleAddClick}
        isSmallTitle={true}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <Grid container spacing={2}>
          {offices.map((office) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={office.id} >
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  {office.background_url && (
                    <Box
                      component="img"
                      src={office.background_url}
                      alt={office.name}
                      onClick={() => handleImageClick(office.background_url)}
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        mb: 1,
                      }}
                    />
                  )}
                  <Typography variant="h6" gutterBottom>
                    {office.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {office.type}
                  </Typography>
                  {office.file_generation_in_progress && (
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <HourglassEmptyIcon fontSize="small" color="warning" />
                      <Typography variant="caption" color="warning.main">
                        Avatar is being generated. This may take a few minutes...
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {isRoot && <Button
                    size="small"
                    startIcon={office.file_generation_in_progress ? <CircularProgress size={16} color="inherit" /> : <EditIcon />}
                    onClick={() => handleEditClick(office)}
                    disabled={office.file_generation_in_progress}
                  >
                    {office.file_generation_in_progress ? 'Processing...' : 'Edit'}
                  </Button>}
                  {!isRoot && <Tooltip
                    title="To enable this option, you need to have the 'Avatars' feature enabled in your company."
                    disableHoverListener={hasAvatarsFeature}
                  >
                    <span>
                      <Button
                        size="small"
                        startIcon={office.file_generation_in_progress ? <CircularProgress size={16} color="inherit" /> : <EditIcon />}
                        onClick={() => handleEditClick(office)}
                        disabled={office.file_generation_in_progress || !hasAvatarsFeature}
                      >
                        {office.file_generation_in_progress ? 'Processing...' : 'Edit'}
                      </Button>
                    </span>
                  </Tooltip>}
                  {isRoot && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(office)}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && offices.length === 0 && (
        <NoData
          message="No virtual office found for this company group."
          actionText="Add Office"
          onAction={handleAddClick}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Virtual Office"
        content={`Are you sure you want to delete the office "${officeToDelete?.name}"? This action cannot be undone.`}
        loading={deleteMutation.isLoading}
      />


      {/* Full image preview dialog */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="img"
            src={selectedImage}
            alt="Office Background"
            sx={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>

      <VirtualOfficeForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        companyId={companyId}
        office={selectedOffice}
      />
    </Box>
  );
}
