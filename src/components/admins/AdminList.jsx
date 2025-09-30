import { useState } from 'react';
import {
  Alert,
  Grid,
  Box,
  Pagination,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { createUser, getUsers, updateUser, deleteUser } from '../../api/user';
import { deleteCompanyGroupUser } from '../../api/companyGroups';

import useCustomQuery from '../../hooks/useCustomQuery';
import useCustomMutation from '../../hooks/useCustomMutation';

import SectionHeader from '../common/page-header/SectionHeader';
import AddEditAdminDialog from './AddEditAdminDialog';
import DeleteDialog from '../common/delete-dialog/DeleteDialog';
import AdminCard from './AdminCard';
import NoData from '../common/no-data/NoData';
import Loading from '../common/loading/loading';

import { notifySuccess } from '../../helpers/utils/notify';

const PAGE_SIZE = 8;

export default function AdminList({ companyId, companyGroupId, role }) {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const {
    data: adminsData,
    isLoading,
    isError,
    error,
  } = useCustomQuery({
    queryKey: ['users', companyId, companyGroupId, page],
    queryFn: () =>
      getUsers({ companyId, companyGroupId, page, limit: PAGE_SIZE }),
    keepPreviousData: true,
  });

  const addAdminMutation = useCustomMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users', companyId, companyGroupId]);
      notifySuccess('Admin successfully added.');
    },
  });

  const updateAdminMutation = useCustomMutation({
    mutationFn: ({ userId, data }) => updateUser({ userId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users', companyId, companyGroupId]);
      notifySuccess('Admin successfully updated.');
    },
  });

  const deleteAdminMutation = useCustomMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users', companyId, companyGroupId]);
      notifySuccess('Admin successfully deleted.');
    },
  });

  const handleAddClick = () => {
    setEditMode(false);
    setEditingUser(null);
    setOpenModal(true);
  };

  const handleEditClick = (admin) => {
    setEditMode(true);
    setEditingUser(admin);
    setOpenModal(true);
  };

  const handleDeleteClick = (admin) => {
    setUserToDelete(admin);
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete?.id) {
      deleteAdminMutation.mutate(userToDelete.id);
      setOpenDeleteConfirm(false);
    }
  };

  const handleSubmit = async (formData) => {
    const cleanedData = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
      role: role === 'admin' ? 'admin' : 'group_admin',
      company: companyId ? { id: companyId } : undefined,
      company_group: companyGroupId ? { id: companyGroupId } : undefined,
    };

    try {
      if (editMode && editingUser?.id) {
        if (!cleanedData.password) delete cleanedData.password;
        await updateAdminMutation.mutateAsync({
          userId: editingUser.id,
          data: cleanedData,
        });
      } else {
        await addAdminMutation.mutateAsync(cleanedData);
      }

      setOpenModal(false);
      setEditingUser(null);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const admins = adminsData?.data || [];
  const total = adminsData?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (isLoading) return <Loading />;

  return (
    <Box>
      {isError && (
        <Alert severity="error">Error loading admins: {error.message}</Alert>
      )}

      <SectionHeader
        title="Admins"
        buttonText="Add Admin"
        onButtonClick={handleAddClick}
        isSmallTitle= {true}
      />

      {!isLoading && !isError && admins.length > 0 && (
        <>
          <Grid container spacing={2}>
            {admins.map((admin) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={admin.id}>
                <AdminCard
                  admin={admin}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {!isLoading && !isError && admins.length === 0 && (
        <NoData
          message="No admins found for this company group."
          actionText="Add Admin"
          onAction={handleAddClick}
        />
      )}

      <AddEditAdminDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingUser(null);
          setEditMode(false);
        }}
        onSubmit={handleSubmit}
        formData={editingUser || {}}
        editMode={editMode}
        isLoading={addAdminMutation.isPending || updateAdminMutation.isPending}
      />

      <DeleteDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm"
        content={`Are you sure you want to delete admin ${userToDelete?.first_name || ''} ${userToDelete?.last_name || ''}?`}
      />
    </Box>
  );
}
