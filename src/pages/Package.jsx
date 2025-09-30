import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useQueryClient } from '@tanstack/react-query';
import { getPackages, deletePackage } from '../api/packages';
import AddEditPackageModal from '../components/packages/AddEditPackageModal';
import SectionHeader from '../components/common/page-header/SectionHeader';
import useCustomQuery from '../hooks/useCustomQuery';
import useCustomMutation from '../hooks/useCustomMutation';
import DeleteDialog from '../components/common/delete-dialog/DeleteDialog';
import Loading from '../components/common/loading/loading';
import { notifySuccess } from '../helpers/utils/notify';

export default function Packages() {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(null);

  const { data: packages, isLoading } = useCustomQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
  });

  const deleteMutation = useCustomMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
      setDeleteConfirmOpen(false);
      setSelectedPackage(null);
      notifySuccess('Package deleted successfully');
    },
  });

  const handleAdd = () => {
    setEditMode(false);
    setSelectedPackage(null);
    setOpen(true);
  };

  const handleEdit = (pkg) => {
    setEditMode(true);
    setSelectedPackage(pkg);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedPackage.id);
  };

  const handleModalClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedPackage(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box p={4}>
      <SectionHeader
        title="Packages"
        buttonText="Add Package"
        onButtonClick={handleAdd}
      />

      {packages?.data.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography color="text.secondary">No packages found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {packages?.data.map((pkg) => (
            <Grid key={pkg.id} size={{ xs: 6, md: 8, lg: 3 }}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Typography variant="h6">{pkg.name}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body1" color="text.primary">
                      <strong>Price:</strong> {pkg.price}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      <strong>Conversations Limit:</strong> {pkg.conversations_limit}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(pkg)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AddEditPackageModal
        open={open}
        editMode={editMode}
        defaultValues={selectedPackage || {}}
        onClose={handleModalClose}
        isSaving={deleteMutation.isPending}
      />

      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={'Delete Package'}
        content={
          'Are you sure you want to delete this package? This action cannot be undone.'
        }
      />
    </Box>
  );
}
