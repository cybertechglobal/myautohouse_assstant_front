import { useState } from 'react';
import { Box, Grid, Alert } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { getCompanyFeaturePrice, deleteCompanyFeatures } from '../../../api/companies';

import useCustomQuery from '../../../hooks/useCustomQuery';
import useCustomMutation from '../../../hooks/useCustomMutation';

import SectionHeader from '../../common/page-header/SectionHeader';
import AddEditFeatureDialog from './AddEditFeatureDialog';
import DeleteDialog from '../../common/delete-dialog/DeleteDialog';
import FeatureCard from './FeatureCard';
import NoData from '../../common/no-data/NoData';
import Loading from '../../common/loading/loading';

export default function FeaturesList({ companyId }) {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: featuresData,
    isLoading,
    isError,
    error,
  } = useCustomQuery({
    queryKey: ['features-price', companyId],
    queryFn: () => getCompanyFeaturePrice(companyId),
    keepPreviousData: true,
  });

  const deleteFeatureMutation = useCustomMutation({
    mutationFn: deleteCompanyFeatures,
    onSuccess: () => {
      queryClient.invalidateQueries(['features-price', companyId]);
      notifySuccess('Feature successfully deleted.');
      setOpenDeleteConfirm(false);
    },
  });

  const handleAddClick = () => {
    setEditMode(false);
    setEditingFeature(null);
    setOpenModal(true);
  };

  const handleEditClick = (feature) => {
    setEditMode(true);
    setEditingFeature(feature);
    setOpenModal(true);
  };

  const handleDeleteClick = (feature) => {
    setFeatureToDelete(feature);
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (featureToDelete?.id) {
      const featureId = featureToDelete?.feature_id;
      deleteFeatureMutation.mutate({ companyId, featureId });
      setOpenDeleteConfirm(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Box>
      {isError && <Alert severity="error">Error loading features price: {error.message}</Alert>}

      <SectionHeader
        title="Features"
        buttonText="Add Feature"
        onButtonClick={handleAddClick}
        isSmallTitle={true}
      />

      {!isLoading && !isError && featuresData.length > 0 && (
        <>
          <Grid container spacing={2}>
            {featuresData.map((feature) => (
              <Grid key={feature.id} size={{ xs: 6, md: 8, lg: 3 }}>
                <FeatureCard
                  feature={feature}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {!isLoading && !isError && featuresData.length === 0 && (
        <NoData
          message="No features-price found for this company."
          actionText="Add Feature"
          onAction={handleAddClick}
        />
      )}

      <AddEditFeatureDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingFeature(null);
          setEditMode(false);
        }}
        formData={editingFeature || {}}
        editMode={editMode}
        companyId={companyId}
      />

      <DeleteDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm"
        content={`Are you sure you want to delete feature ${featureToDelete?.name || ''}?`}
      />
    </Box>
  );
}
