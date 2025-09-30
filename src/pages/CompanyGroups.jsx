import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Pagination,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';

import { useQueryClient } from '@tanstack/react-query';
import useCustomMutation from '../hooks/useCustomMutation';
import useCustomQuery from '../hooks/useCustomQuery';

import {
  getCompanyGroups,
  createCompanyGroup,
  deleteCompanyGroup,
  updateCompanyGroup,
  uploadCompanyGroupLogo,
} from '../api/companyGroups';

import SectionHeader from '../components/common/page-header/SectionHeader';
import AddEditGroupModal from '../components/company-groups/AddEditGroupModal';
import DeleteGroupDialog from '../components/company-groups/DeleteGroupDialog';
import Loading from '../components/common/loading/loading';
import NoData from '../components/common/no-data/NoData';
import { notifySuccess } from '../helpers/utils/notify';
import CompanyGroupCard from '../components/company-groups/CompanyGroupCard';

export default function CompanyGroups() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedGroup, setSelectedGroup] = React.useState(null);

  const { data: groups, isLoading, error } = useCustomQuery({
    queryKey: ['companyGroups'],
    queryFn: getCompanyGroups,
  });

  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = React.useState(1);

  const paginatedData = groups?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);


  const createMutation = useCustomMutation({
    mutationFn: createCompanyGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['companyGroups']);
      notifySuccess('Group added successfully');
    },
  });

  const updateMutation = useCustomMutation({
    mutationFn: updateCompanyGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['companyGroups']);
      notifySuccess('Group updated successfully');
    },
  });

  const deleteMutation = useCustomMutation({
    mutationFn: deleteCompanyGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['companyGroups']);
      setDeleteConfirmOpen(false);
      setSelectedGroup(null);
      notifySuccess('Group deleted successfully');
    },
    onError: (error) => {
      setSnackbarMessage(error.message || 'Error deleting group');
      setSnackbarOpen(true);
    },
  });

  const uploadLogoMutation = useCustomMutation({
    mutationFn: ({ groupId, file }) => {
      const formData = new FormData();
      formData.append('logo', file);
      return uploadCompanyGroupLogo(groupId, formData);
    },
  });

  const handleAddGroup = () => {
    setEditMode(false);
    setSelectedGroup(null);
    setOpen(true);
  };

  const handleEditGroup = (group) => {
    setEditMode(true);
    setSelectedGroup(group);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteGroup = () => {
    deleteMutation.mutate(selectedGroup.id);
  };


  const handleSubmit = async (formData) => {
    const { logo, ...rest } = formData;

    const cleanedData = Object.fromEntries(
      Object.entries(rest).filter(
        ([_, v]) => v !== '' && v !== undefined && v !== null
      )
    );

    try {
      let groupId;
      let updatedGroup = null;

      if (editMode && selectedGroup?.id) {
        await updateMutation.mutateAsync({
          companyGroupId: selectedGroup.id,
          body: cleanedData,
        });
        groupId = selectedGroup.id;
      } else {
        const res = await createMutation.mutateAsync(cleanedData);
        groupId = res?.id;
        updatedGroup = res;
      }

      if (logo && groupId) {
        const uploaded = await uploadLogoMutation.mutateAsync({
          groupId,
          file: logo,
        });

        if (editMode) {
          updatedGroup = {
            ...(selectedGroup || {}),
            ...cleanedData,
            logo_url: uploaded.logo_url,
          };
        } else {
          updatedGroup = {
            ...(updatedGroup || {}),
            logo_url: uploaded.logo_url,
          };
        }
      } else if (editMode) {
        updatedGroup = {
          ...(selectedGroup || {}),
          ...cleanedData,
        };
      }

      queryClient.setQueryData(['companyGroups'], (old = []) => {
        const existingIndex = old.findIndex((c) => c.id === updatedGroup.id);

        if (existingIndex !== -1) {
          const updatedData = [...old];
          updatedData[existingIndex] = updatedGroup;
          return updatedData;
        }

        return [updatedGroup, ...old];
      });

      setOpen(false);
      setEditMode(false);
      setSelectedGroup(null);
    } catch (err) {
      console.error(err);
    }
  };


  const navigateToCompanyGroup = (groupId) => {
    navigate(`/company-groups/${groupId}`);
  };

  if (isLoading) return <Loading />;
  if (error) return <Typography>Error loading data: {error.message}</Typography>;

  return (
    <Box p={4}>

      <SectionHeader
        title="Auto House Groups"
        buttonText="Add Group"
        onButtonClick={handleAddGroup}
      />

      {groups.length === 0 ? (
        <NoData
          message="No Auto House groups found."
          actionText="Add Group"
          onAction={handleAddGroup}
        />
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedData.map((group) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={group.id}>
                <CompanyGroupCard
                  group={group}
                  onClick={navigateToCompanyGroup}
                  onEdit={handleEditGroup}
                  onDelete={() => {
                    setDeleteConfirmOpen(true);
                    setSelectedGroup(group);
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(groups.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      <AddEditGroupModal
        open={open}
        editMode={editMode}
        defaultValues={selectedGroup || {}}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setSelectedGroup(null);
        }}
        onSubmit={handleSubmit}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteGroupDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onDelete={handleDeleteGroup}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEditGroup(selectedGroup)}>Edit</MenuItem>
        <MenuItem
          onClick={() => {
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


