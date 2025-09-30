import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useQueryClient } from '@tanstack/react-query';
import useCustomQuery from '../hooks/useCustomQuery';
import useCustomMutation from '../hooks/useCustomMutation';
import { getDataCollectionEntries, deleteDataCollectionEntry, getDataCollection } from '../api/dataCollections';
import Loading from '../components/common/loading/loading';
import DeleteDialog from '../components/common/delete-dialog/DeleteDialog';
import DialogHeader from '../components/common/dialog-header/DialogHeader';


export default function DataCollectionEntriesPage() {
  const queryClient = useQueryClient();
  const { companyId, collectionId } = useParams();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const { data, isLoading } = useCustomQuery({
    queryKey: ['dataCollectionEntries', companyId, collectionId],
    queryFn: () => getDataCollectionEntries(companyId, collectionId),
  });

  const { data: collection, isLoading: dataCollectionIsLoading } = useCustomQuery({
    queryKey: ['dataCollection', companyId, collectionId],
    queryFn: () => getDataCollection(companyId, collectionId),
  });

  const deleteMutation = useCustomMutation({
    mutationFn: ({ companyId, dataCollectionId, entryId }) =>
      deleteDataCollectionEntry({ companyId, dataCollectionId, entryId }),
    onSuccess: (_data, variables) => {
      const { entryId } = variables;

      queryClient.setQueryData(['dataCollectionEntries', companyId, collectionId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          entries: oldData.entries.filter((entry) => entry.id !== entryId),
        };
      });

      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    },

  });


  if (isLoading || dataCollectionIsLoading) return <Loading />;

  const entries = data?.entries || [];

  const columns = [
    {
      field: 'previewPhoto',
      headerName: 'Photo',
      width: 100,
      renderCell: (params) => {
        const url = params.row.previewPhoto?.thumbnailUrl;
        return url ? (
          <img
            src={url}
            alt="Preview"
            style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          'N/A'
        );
      },
      sortable: false,
      filterable: false,
    },
    { field: 'model', headerName: 'Model', width: 200 },
    { field: 'make', headerName: 'Make', width: 120 },
    { field: 'bodyType', headerName: 'Body Type', width: 120 },
    { field: 'mileage', headerName: 'Mileage', width: 100 },
    {
      field: 'fuel',
      headerName: 'Fuel',
      width: 100,
      valueGetter: (params) => {
        return params?.row?.fuel?.wording || '';
      },
    },
    { field: 'power', headerName: 'Power', width: 80 },
    { field: 'previousOwners', headerName: 'Prev. Owners', width: 120 },
    { field: 'priceGross', headerName: 'Price (€)', width: 120 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const handlePreview = () => setSelectedEntry(params.row.originalData);

        const handleDeleteClick = () => {
          setEntryToDelete(params.row);
          setDeleteDialogOpen(true);
          console.log(entryToDelete)
        };

        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Details">
              <IconButton size="small" onClick={handlePreview}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );

      },
    }
  ];

  const rows = entries.map((entry) => {
    const data = entry.data || {};
    const retailPrice = data.prices?.find((p) => p.type === 'retail')?.value || data.priceGross || null;

    return {
      id: entry.id,
      make: data.make,
      model: data.model,
      bodyType: data.bodyType,
      mileage: data.mileage,
      power: data.power,
      fuel: data.fuel,
      category: data.category,
      priceGross: retailPrice,
      previousOwners: data.previousOwners,
      previewPhoto: data.previewPhoto,
      originalData: data,
    };
  });

  return (
    <Box p={2}>
      <Card sx={{ my: 4, borderBottom: 'none' }}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h5" fontWeight={600}>
              {collection?.name || 'Untitled Collection'}
            </Typography>

            {collection?.created_at && (
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  Created: {new Date(collection.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                Published: {collection?.published ? 'Yes' : 'No'}
              </Typography>
            </Box>

            {collection?.tags?.length > 0 && (
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="body2">Tags:</Typography>
                {collection.tags.map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      backgroundColor: '#f0f0f0',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.8rem',
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>


      <Box sx={{ width: '100%', maxWidth: '80vw', overflowX: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 20, 50]}
        />
        <Dialog open={!!selectedEntry} onClose={() => setSelectedEntry(null)} maxWidth="md" fullWidth>
          <DialogHeader title={'Vehicle Details'} onClose={() => setSelectedEntry(null)} />
          <DialogContent dividers>
            {selectedEntry && (
              <Box display="flex" flexDirection="column" gap={2}>
                {selectedEntry.previewPhoto?.url && (
                  <img
                    src={selectedEntry.previewPhoto.url}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                )}

                <RecursiveDisplay data={selectedEntry} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' color='inherit' onClick={() => setSelectedEntry(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (entryToDelete) {
            deleteMutation.mutate({
              companyId,
              dataCollectionId: collectionId,
              entryId: entryToDelete.id,
            });
          }
        }}
        title="Delete Entry"
        content="Are you sure you want to delete this entry? This action cannot be undone."
        loading={deleteMutation.isLoading}
      />
    </Box>
  );
}

function RecursiveDisplay({ data, level = 0 }) {
  if (!data || typeof data !== 'object') return null;

  return Object.entries(data).map(([key, value]) => {
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    return (
      <Box key={key} ml={level * 2}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatKey(key)}:
        </Typography>

        {isObject && !isArray ? (
          <RecursiveDisplay data={value} level={level + 1} />
        ) : isArray ? (
          value.length === 0 ? (
            <Typography variant="body2" color="text.secondary">[Empty Array]</Typography>
          ) : (
            value.map((item, index) => (
              <Box key={index} ml={2}>
                <Typography variant="body2" color="text.secondary">
                  Item {index + 1}:
                </Typography>
                <RecursiveDisplay data={item} level={level + 2} />
              </Box>
            ))
          )
        ) : (
          <Typography variant="body2" color="text.primary">
            {formatDisplayValue(value)}
          </Typography>
        )}
      </Box>
    );
  });
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDisplayValue(value) {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toString();

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) return moment(value).format('YYYY-MM-DD HH:mm');
    return value;
  }

  const fallbackFields = ['wording', 'name', 'label', 'title', 'value'];
  for (const field of fallbackFields) {
    if (value && typeof value === 'object' && value[field]) {
      return value[field];
    }
  }

  return JSON.stringify(value);
}
