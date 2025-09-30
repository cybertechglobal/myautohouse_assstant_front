import React, { useState } from 'react';
import {
  Grid,
  Box,
} from '@mui/material';

import useCustomQuery from '../../hooks/useCustomQuery';
import useCustomMutation from '../../hooks/useCustomMutation';

import {
  getAssistants,
  deleteAssistant,
} from '../../api/assistants';
import { getCompanyById, updateCompany } from '../../api/companies';

import SectionHeader from '../common/page-header/SectionHeader';
import AssistantForm from './AssistantForm';
import DeleteDialog from '../common/delete-dialog/DeleteDialog';
import AssistantCard from './AssistantCard';
import { useQueryClient } from '@tanstack/react-query';
import { notifySuccess } from '../../helpers/utils/notify';
import NoData from '../common/no-data/NoData';
import Loading from '../common/loading/loading';

export default function AssistantList({ companyId, isSmallTitle = true }) {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const { data: assistants = [], isLoading } = useCustomQuery({
    queryKey: ['assistants', companyId],
    queryFn: () => getAssistants(companyId),
  });

  const { data: company } = useCustomQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyById(companyId),
  });

  const deleteMutation = useCustomMutation({
    mutationFn: ({ companyId, assistantId }) =>
      deleteAssistant({ companyId, assistantId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['assistants', companyId]);
      notifySuccess('Assistant deleted successfully.');
    },
  });

  const setDefaultMutation = useCustomMutation({
    mutationFn: ({ companyId, assistantId }) =>
      updateCompany({
        companyId,
        data: { default_assistant_id: assistantId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['company', companyId]);
      notifySuccess('Default assistant updated.');
    },
  });

  const handleEdit = (assistant) => {
    setSelectedAssistant(assistant);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteHandler = () => {
    deleteMutation.mutate({ companyId, assistantId: confirmDelete.id });
    setConfirmDelete({ open: false, id: null });
  };

  const handleSetDefault = (assistantId) => {
    setDefaultMutation.mutate({ companyId, assistantId });
  };

  if (isLoading) return <Loading />;

  return (
    <Box>

      <SectionHeader
        title="Assistants"
        buttonText="Add Assistant"
        onButtonClick={() => {
          setSelectedAssistant(null);
          setOpenForm(true);
        }}
        isSmallTitle={isSmallTitle}
      />

      {assistants.length === 0 ? (
        <NoData
          message="No assistants found."
          actionText="Add Assistant"
          onAction={() => {
            setSelectedAssistant(null);
            setOpenForm(true);
          }}
        />
      ) : (
        <Grid container spacing={2}>
          {assistants.map((assistant) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={assistant.id}>
              <AssistantCard
                assistant={assistant}
                onEdit={() => handleEdit(assistant)}
                onDelete={() => handleDelete(assistant.id)}
                onSetDefault={() => handleSetDefault(assistant.id)}
                isDefault={company?.default_assistant_id === assistant.id}
                companyId={companyId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AssistantForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        assistant={selectedAssistant}
        companyId={companyId}
        allAssistants={assistants}
      />

      <DeleteDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={confirmDeleteHandler}
        title="Delete Assistant"
        content="Are you sure you want to delete this assistant?"
      />
    </Box>
  );
}
