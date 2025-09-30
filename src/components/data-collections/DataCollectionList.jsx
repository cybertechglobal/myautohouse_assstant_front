import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Grid, Typography, Tooltip, Card } from '@mui/material';

import useCustomQuery from '../../hooks/useCustomQuery';
import useCustomMutation from '../../hooks/useCustomMutation';
import { useQueryClient } from '@tanstack/react-query';

import {
  getDataCollections,
  deleteDataCollection,
  getDataCollectionEntries,
  publishDataCollection
} from '../../api/dataCollections';
import AddEditDataCollectionDialog from './AddEditDataCollectionDialog';
import ImportDataCollectionDialog from './ImportDataCollectionDialog';
import DeleteDialog from '../common/delete-dialog/DeleteDialog';
import NoData from '../common/no-data/NoData';
import Loading from '../common/loading/loading';
import { notifySuccess } from '../../helpers/utils/notify';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';

import SectionHeader from '../common/page-header/SectionHeader';
import { useAuthStore } from '../../store/authStore';

export default function DataCollectionList({ companyId }) {

  const queryClient = useQueryClient();

  const { user } = useAuthStore();
  const isRoot = user?.role === 'root';

  const [open, setOpen] = React.useState(false);
  const [openImport, setOpenImport] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();

  const [selectedCollection, setSelectedCollection] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const { data, isLoading } = useCustomQuery({
    queryKey: ['dataCollections', companyId],
    queryFn: () => getDataCollections(companyId),
  });

  const handleAdd = () => {
    setOpen(true);
    setSelectedCollection(null)
  };

  const handleImport = (collection) => {
    setOpenImport(true)
    setSelectedCollection(collection);
  }

  const handleEdit = (collection) => {
    setSelectedCollection(collection);
    setOpen(true);
  };

  const deleteMutation = useCustomMutation({
    mutationFn: () => deleteDataCollection(companyId, selectedCollection.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['dataCollections', companyId]);
      notifySuccess('Data Collection deleted');
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      console.error(error);
      notifySuccess('Error deleting data collection');
    },
  });

  const handleDelete = (collection) => {
    setSelectedCollection(collection);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  const publishMutation = useCustomMutation({
    mutationFn: ({ collectionId }) =>
      publishDataCollection(companyId, collectionId),
    onSuccess: () => {
      notifySuccess('Data Collection published successfully');
      queryClient.invalidateQueries(['dataCollections', companyId]);
    },
    onError: () => {
      notifySuccess('Failed to publish data collection');
    },
  });

  const handlePublish = (collection) => {
    publishMutation.mutate({ collectionId: collection.id });
  };

  if (isLoading) return <Loading />;

  return (
    <Box>
      <SectionHeader
        buttonText={isRoot ? 'Add Data Collection' : ''}
        onButtonClick={isRoot ? handleAdd : null}
        isSmallTitle={true}
      />

      {data.data.length === 0 ? (
        <NoData message="No data collections found." actionText='Add Data Collection' onAction={handleAdd} />
      ) : (
        <Grid container spacing={2}>
          {data.data.map((collection) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
              key={collection.id}
            >
              <Card>
                <Box
                  sx={{
                    p: 2,
                  }}
                >
                  <Typography variant="h6">{collection.name}</Typography>
                  <Typography variant="body2">
                    Tags: {collection.tags?.join(', ') || 'None'}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() =>
                      navigate(`/companies/${companyId}/data-collections/${collection.id}/entries`)
                    }
                    startIcon={<SearchIcon />}
                    sx={{ textTransform: 'none', mt: 2 }}
                  >
                    View Entries
                  </Button>


                  {isRoot && (
                    <Box display="flex" justifyContent="space-between" gap={1} sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleImport(collection)}
                        startIcon={<CloudUploadIcon />}
                        sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                      >
                        Import
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleEdit(collection)}
                        startIcon={<EditIcon />}
                        sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                      <Tooltip title="Send data to AI for processing">
                        <span>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handlePublish(collection)}
                            disabled={publishMutation.isLoading}
                            startIcon={<PublishIcon />}
                            sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                          >
                            Publish
                          </Button>
                        </span>
                      </Tooltip>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(collection)}
                        startIcon={<DeleteIcon />}
                        sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AddEditDataCollectionDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCollection(null);
        }}
        defaultValues={selectedCollection || {}}
        companyId={companyId}
      />

      <ImportDataCollectionDialog
        open={openImport}
        onClose={() => {
          setOpenImport(false);
          setSelectedCollection(null);
        }}
        companyId={companyId}
        collectionId={selectedCollection?.id}
        webhookToken={selectedCollection?.webhook_token}
      />

      <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={handleDeleteConfirm} title={'Delete Data Collection'} content={'Are you sure you want to delete the data collection? '} />
    </Box>
  );
}
