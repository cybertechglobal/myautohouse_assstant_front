import React from 'react';
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Autocomplete,
  InputAdornment
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search'

import { getCompanySummaries } from '../../api/companies';
import { getAssistants } from '../../api/assistants';
import useCustomQuery from '../../hooks/useCustomQuery';
import Loading from '../common/loading/loading';
import SummaryDisplay from './SummaryDisplay'
import NoData from '../common/no-data/NoData';

// Debounce hook
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Summaries({ companyId }) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(ITEMS_PER_PAGE);
  const [isLead, setIsLead] = React.useState('true');
  const [search, setSearch] = React.useState('');
  const [assistantId, setAssistantId] = React.useState('');

  const debouncedSearch = useDebounce(search, 500);

  const params = {
    page,
    limit,
    is_lead: isLead === '' ? undefined : isLead === 'true',
    search: debouncedSearch || undefined,
    assistant_id: assistantId || undefined,
  };

  const { data, isLoading, error } = useCustomQuery({
    queryKey: ['companySummaries', companyId, params],
    queryFn: () => getCompanySummaries(companyId, params),
  });

  const {
    data: assistantsData,
    isLoading: assistantsLoading,
  } = useCustomQuery({
    queryKey: ['assistants', companyId],
    queryFn: () => getAssistants(companyId),
  });


  if (isLoading) return <Loading />;
  if (error) return <Typography>Error loading summaries</Typography>;

  return (
    <Box>
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Search"
          placeholder="Search by term"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
        />
        <Autocomplete
          size="small"
          options={assistantsData || []}
          getOptionLabel={(option) => option.name}
          value={assistantsData?.find((a) => a.id === assistantId) || null}
          onChange={(_, newValue) => {
            setAssistantId(newValue?.id || '');
            setPage(1);
          }}
          loading={assistantsLoading}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assistant"
              placeholder="Search assistant"
            />
          )}
          sx={{ minWidth: 180 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="is-lead-label">Lead</InputLabel>
          <Select
            labelId="is-lead-label"
            value={isLead}
            label="Lead"
            onChange={(e) => setIsLead(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
        {data?.data?.length === 0 ? (
          <NoData message="No summaries found." />
        ) : (
          <>
            {data.data.map((summary) => (
              <SummaryDisplay summary={summary.summary} key={summary.id} />
            ))}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil((data?.total || 0) / limit)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
