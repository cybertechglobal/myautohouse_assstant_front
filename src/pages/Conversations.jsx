import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Pagination,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  createConversation,
  deleteConversation,
  updateConversation,
} from '../api/conversations'; // API funkcije

//import AddEditConversationModal from '../components/conversations/AddEditConversationModal'; // Komponenta za dodavanje/uređivanje konverzacija
//import DeleteConversationDialog from '../components/conversations/DeleteConversationDialog'; // Komponenta za brisanje konverzacije

import Loading from '../components/common/loading/loading';
import useCustomQuery from '../hooks/useCustomQuery';
import useCustomMutation from '../hooks/useCustomMutation';

export default function Conversations() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedConversation, setSelectedConversation] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const ITEMS_PER_PAGE = 50;
  const [page, setPage] = React.useState(1);

  // API poziv za konverzacije
  const { data: conversations, isLoading } = useCustomQuery({
    queryKey: ['conversations', page], // Parametri koji se prosleđuju u API
    queryFn: () => getConversations({ page, limit: ITEMS_PER_PAGE, company_id:'e76e9079-be50-4a5e-b512-babd5057202a' }), // API poziv
  });
  const createMutation = useCustomMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    },
  });

  // Mutation za ažuriranje
  const updateMutation = useCustomMutation({
    mutationFn: updateConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    },
  });

  // Mutation za brisanje
  const deleteMutation = useCustomMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
      setDeleteConfirmOpen(false);
      setSelectedConversation(null);
      setSnackbarMessage('Conversation deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    },
    onError: () => {
      setSnackbarMessage('Error deleting conversation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
  });
  const handleAdd = () => {
    setEditMode(false);
    setSelectedConversation(null);
    setOpen(true);
  };

  const handleEdit = (conversation) => {
    setEditMode(true);
    setSelectedConversation(conversation);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedConversation.id);
  };

  const handleMenuClick = (e, conversation) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedConversation(conversation);
  };

  const handleSubmit = async (formData) => {
    try {
      let conversation;
      if (editMode && selectedConversation?.id) {
        conversation = await updateMutation.mutateAsync(
          selectedConversation.id,
          formData
        );
      } else {
        conversation = await createMutation.mutateAsync(formData);
      }

      setOpen(false);
      setSelectedConversation(null);
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
      <Typography variant="h4" gutterBottom>
        Conversations
      </Typography>

      {conversations?.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography color="text.secondary">
            No conversations found.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {conversations?.map((conversation) => (
              <Grid size={{ xs: 6, md: 8, lg: 3 }} key={conversation.id}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                    >
                      <Typography variant="h6">{conversation.name}</Typography>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, conversation)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body1" color="text.primary">
                        <strong>Assistant:</strong>{' '}
                        {conversation.assistant_name}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        <strong>User:</strong> {conversation.user_name}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        <strong>Messages:</strong> {conversation.message_count}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(conversations?.total / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
      {/* 
      <AddEditConversationModal
        open={open}
        editMode={editMode}
        defaultValues={selectedConversation || {}}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setSelectedConversation(null);
        }}
        onSubmit={handleSubmit}
        isSaving={createMutation.isLoading || updateMutation.isLoading}
      />

      <DeleteConversationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onDelete={handleDelete}
      />*/}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={(e) => handleEdit(selectedConversation)}>
          Edit
        </MenuItem>
        <MenuItem onClick={(e) => setDeleteConfirmOpen(true)}>Delete</MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
