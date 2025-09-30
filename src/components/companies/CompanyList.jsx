import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Grid,
  Pagination,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  InputAdornment,
  FormControl
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import useCustomMutation from '../../hooks/useCustomMutation';
import useCustomQuery from '../../hooks/useCustomQuery';
import { useQueryClient } from '@tanstack/react-query';

import {
  getCompanies,
  deleteCompany,
} from '../../api/companies';
import { getCompanyGroups, getCompanyGroupCompanies } from '../../api/companyGroups';

import SectionHeader from '../common/page-header/SectionHeader';
import AddEditCompanyDialog from '../../components/companies/AddEditCompanyDialog';
import Loading from '../../components/common/loading/loading';
import CompanyCard from '../../components/companies/CompanyCard';
import DeleteDialog from '../../components/common/delete-dialog/DeleteDialog';
import NoData from '../../components/common/no-data/NoData';

import { notifySuccess } from '../../helpers/utils/notify';
import { useAuthStore } from '../../store/authStore';
import { countries } from '../../helpers/consts/countries';


function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function CompanyList() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const { companyGroupId: urlCompanyGroupId } = useParams();

  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);

  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = React.useState(1);

  const [search, setSearch] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [order, setOrder] = React.useState('asc');

  const debouncedSearch = useDebounce(search, 500);


  const companyGroupId =
    currentUser?.role === 'group_admin'
      ? currentUser.company_group.id
      : urlCompanyGroupId;

  const rawParams = {
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
    country: selectedCountry,
    order,
  };

  const params = Object.fromEntries(
    Object.entries(rawParams).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined
    )
  );

  const { data: companies, isLoading } = useCustomQuery({
    queryKey: ['companies', companyGroupId, params],
    queryFn: () => {
      if (companyGroupId) {
        return getCompanyGroupCompanies(companyGroupId, params);
      } else {
        return getCompanies(params);
      }
    },
  });

  const paginatedData = companies?.data || [];

  const { data: companyGroups } = useCustomQuery({
    queryKey: ['companyGroups'],
    queryFn: getCompanyGroups,
    enabled: currentUser?.role === 'root',
  });

  let filteredCompanyGroups = companyGroups; 

  if (currentUser?.role === 'group_admin' && currentUser?.companyGroups) {
    filteredCompanyGroups = currentUser.companyGroups;
  }

  const deleteMutation = useCustomMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      setDeleteConfirmOpen(false);
      setSelectedCompany(null);
      notifySuccess('Company deleted successfully');
    },
  });

  const selectedGroup = filteredCompanyGroups?.find(
    (group) => group.id === companyGroupId
  );

  const handleAdd = () => {
    setEditMode(false);
    setSelectedCompany({
      company_group_id: selectedGroup?.id || null,
    });
    setOpen(true);
  };

  const handleEdit = (company) => {
    setEditMode(true);
    setSelectedCompany(company);
    setOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedCompany.id);
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/companies/${companyId}`);
  };

  if (isLoading) return <Loading />;

  return (
    <Box p={urlCompanyGroupId ? 0 : 4}>
      <SectionHeader
        title="Auto Houses"
        buttonText="Add Auto House"
        onButtonClick={handleAdd}
        isSmallTitle={urlCompanyGroupId}
      />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginBottom: '32px',
          padding: '10px',
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ maxWidth: '570px', width: '100%' }}
        >
          <Grid size={{ xs: 12, sm: 6, }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by Name"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, }}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.label}
              value={selectedCountry ? countries.find((c) => c.label === selectedCountry) : null}
              onChange={(_, newValue) => {
                setPage(1);
                setSelectedCountry(newValue?.label || '');
              }}
              autoHighlight
              size="small"
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <Box
                    component="li"
                    key={key}
                    sx={{ '& > img': { mr: 1.5, flexShrink: 0 } }}
                    {...rest}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Country"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

      </Box>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ fontSize: '0.9rem', mb: 0.5 }}>Sort by:</Box>
        <FormControl>
          <Select
            size="small"
            displayEmpty
            value={order}
            onChange={(e) => {
              setPage(1);
              setOrder(e.target.value);
            }}
          >
            <MenuItem value="asc">Name (A–Z)</MenuItem>
            <MenuItem value="desc">Name (Z–A)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {paginatedData.length === 0 ? (
        <NoData
          message="No companies found."
          actionText="Add Company"
          onAction={handleAdd}
        />
      ) : (
        <>
          <Grid container spacing={2} mt={2}>
            {paginatedData.map((company) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
                key={company.id}
              >
                <CompanyCard
                  company={company}
                  onClick={handleCompanyClick}
                  onEdit={handleEdit}
                  onDelete={() => {
                    setSelectedCompany(company);
                    setDeleteConfirmOpen(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil((companies?.total || 0) / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      <AddEditCompanyDialog
        open={open}
        editMode={editMode}
        defaultValues={selectedCompany || {}}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setSelectedCompany(null);
        }}
        companyGroups={filteredCompanyGroups}
        lockedCompanyGroup={!!companyGroupId}
        queryParams={{
          ...params,
          companyGroupId: currentUser?.role === 'group_admin' ? currentUser.company_group.id : companyGroupId,
        }}
      />

      <DeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Company"
        content={`Are you sure you want to delete the company "${selectedCompany?.name}"?`}
      />
    </Box>
  );
}
