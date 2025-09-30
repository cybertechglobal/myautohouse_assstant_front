import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
} from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';

import { getCompanyById } from '../api/companies';
import Loading from '../components/common/loading/loading';
import IntegrationSnippet from '../components/integration-snippet/IntegrationSnippet';


import VirtualOfficeList from '../components/virtual-office/VirtualOfficeList';

import DataCollectionList from '../components/data-collections/DataCollectionList';

import { useAuthStore } from '../store/authStore';

export default function Settings() {

  const currentUser = useAuthStore((state) => state.user);
  const companyId = currentUser.company.id;

  const {
    data: company,
    isLoading: companyLoading,
    error: companyError,
  } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyById(companyId),
  });

  const [value, setValue] = React.useState('offices');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (companyLoading) return <Loading />;
  if (companyError) return <Typography>Error loading company details</Typography>;
  return (
    <Box p={4}>
      {/* Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Company details tabs"
        sx={{
          my: 2,
          overflowX: 'auto',
          '@media (max-width: 920px)': {
            width: '50vh'
          },
          '@media (max-width: 480px)': {
            width: '35vh'
          }
        }}
      >
        <Tab value="offices" label="Virtual Offices" />
        <Tab value="data-collections" label="Data Collections" />
        <Tab value="integration" label="Virtual Office Button" />
      </Tabs>

      {/* Tab Panels */}
      <Card mt={3}>
        <CardContent sx={{ px: 2 }}>
          {value === 'offices' && <VirtualOfficeList companyId={companyId} />}
          {value === 'data-collections' && (
            <DataCollectionList companyId={companyId} />
          )}
          {value === 'integration' && <IntegrationSnippet companyId={companyId} />}
        </CardContent>
      </Card>
    </Box>

  );
}
