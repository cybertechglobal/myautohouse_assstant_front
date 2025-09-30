import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Chip,
  Autocomplete,
} from '@mui/material';
import { getEventLogs } from '../api/events';
import useCustomQuery from '../hooks/useCustomQuery';
import moment from 'moment';
import { getUsers } from '../api/user';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Events() {
  const [filters, setFilters] = useState({
    entity_type: '',
    event_type: '',
    start_date: null,
    end_date: null,
    user_id: '',
    page: 1,
    limit: 20,
  });

  const { data: users } = useCustomQuery({
    queryKey: ['users', filters.page],
    queryFn: () => getUsers({ page: filters.page, limit: filters.limit }),
    keepPreviousData: true,
  });

  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => moment(dateString).format('MMM DD, YYYY HH:mm:ss');

  const getFilteredParams = () => {
    const params = { ...filters };

    if (params.start_date) {
      params.start_date = params.start_date.toISOString();
    }
    if (params.end_date) {
      params.end_date = params.end_date.toISOString();
    }

    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key];
      }
    });

    return params;
  };

  const { data: events, isLoading, isError, error } = useCustomQuery({
    queryKey: ['events', filters],
    queryFn: () => getEventLogs(getFilteredParams()),
    enabled: filters.page > 0,
  });

  const handlePaginationChange = (event, newPage) => {
    setFilters({ ...filters, page: newPage + 1 });
  };

  useEffect(() => {
    console.log("Filters updated: ", filters);
    if (events) {
      setLoading(false);
    }
  }, [filters, events]);

  // Function to display status with color
  const getStatusChip = (status) => {
    switch (status) {
      case 200:
        return <Chip label="Success" color="success" size="small" />;
      case 400:
        return <Chip label="Error" color="error" size="small" />;
      case 500:
        return <Chip label="Server Error" color="warning" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const eventTypes = ['ENTITY_ATTACH', 'ENTITY_UPDATE', 'RESPONSE', 'REQUEST', 'ENTITY_CREATE', 'ENTITY_DELETE'];

  const entityTypes = ['User', 'Subscription', 'DataCollection', 'File', 'AssistantVoice', 'Assistant', 'Voice', 'Company', 'VirtualOffice', 'CompanyGroup', 'Conversation'];

  return (
    <Box p={4}>
      <Typography variant="h4">Event Logs</Typography>

      <Grid container spacing={2} my={4} alignItems="center" justifyContent="flex-start" sx={{ maxWidth: 870 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            size="small"
            options={eventTypes}
            value={filters.event_type}
            onChange={(_, newValue) => setFilters({ ...filters, event_type: newValue })}
            renderInput={(params) => <TextField {...params} label="Event Type" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            size="small"
            options={entityTypes}
            value={filters.entity_type}
            onChange={(_, newValue) => setFilters({ ...filters, entity_type: newValue })}
            renderInput={(params) => <TextField {...params} label="Entity Type" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            size="small"
            options={users?.data || []}
            value={filters.user_id ? users?.data.find((user) => user.id === filters.user_id) : null}
            onChange={(_, newValue) => setFilters({ ...filters, user_id: newValue?.id || '' })}
            getOptionLabel={(option) => option.first_name}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              size="small"
              label="Start Date"
              value={filters.start_date}
              onChange={(newValue) => {
                console.log('Start Date changed:', newValue);
                setFilters({ ...filters, start_date: newValue });
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  maxWidth: '100% !important',
                },
              }}
              sx={{ width: '100% !important' }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              size="small"
              label="End Date"
              value={filters.end_date}
              onChange={(newValue) => {
                setFilters({ ...filters, end_date: newValue });
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  maxWidth: '100% !important',
                },
              }}
              sx={{ width: '100% !important' }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {isLoading || loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper} mt={4}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events?.data?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.data.endpoint}</TableCell>
                    <TableCell>{event.data.method}</TableCell>
                    <TableCell>{event.data.event_type}</TableCell>
                    <TableCell>{formatDate(event.data.timestamp)}</TableCell>
                    <TableCell>{event.data.user_id}</TableCell>
                    <TableCell>{getStatusChip(event.data.status_code)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              count={events?.total || 0}
              rowsPerPage={filters.limit}
              page={filters.page - 1}
              onPageChange={handlePaginationChange}
            />
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
