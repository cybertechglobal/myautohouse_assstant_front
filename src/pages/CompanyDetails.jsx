import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
} from '@mui/material';

import { getCompanyById } from '../api/companies';

import Loading from '../components/common/loading/loading';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';

import AdminList from '../components/admins/AdminList';
import AssistantList from '../components/assistants/AssistantList';
import VirtualOfficeList from '../components/virtual-office/VirtualOfficeList';
import SubscriptionList from '../components/subscriptions/SubscriptionList';
import DataCollectionList from '../components/data-collections/DataCollectionList';
import Summaries from '../components/summaries/summaries';
import FeaturesList from '../components/companies/features/FeaturesList';

export default function CompanyDetails() {
  const { companyId } = useParams();

  const {
    data: company,
    isLoading: companyLoading,
    error: companyError,
  } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyById(companyId),
  });

  const [value, setValue] = React.useState('admins');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (companyLoading) return <Loading />;
  if (companyError) return <Typography>Error loading company details</Typography>;

  return (
    <Box p={4}>
      <Card sx={{ mb: 4, pb: 0, borderBottom: 'none' }}>
        <CardContent sx={{ paddingBottom: '0 !important' }}>
          <Box display="flex" flexDirection="column" gap={1}>
            {company.logo_url && (
              <Box mb={1}>
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  style={{ width: 120, height: 'auto', borderRadius: 8 }}
                />
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5" fontWeight={600}>
                {company.name}
              </Typography>
            </Box>

            {company.description && (
              <Typography variant="body2" color="text.secondary">
                {company.description}
              </Typography>
            )}

            {company.address && (
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {company.address}
                  {company.city ? `, ${company.city}` : ''} {company.postal_code || ''}
                  {company.country ? `, ${company.country}` : ''}
                </Typography>
              </Box>
            )}

            {company.createdAt && (
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  Founded: {new Date(company.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            {company.email && (
              <Box display="flex" alignItems="center" gap={1}>
                <MailOutlineIcon fontSize="small" color="primary" />
                <Typography variant="body2">{company.email}</Typography>
              </Box>
            )}

            {company.phone && (
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body2">{company.phone}</Typography>
              </Box>
            )}

            {company.website && (
              <Box display="flex" alignItems="center" gap={1}>
                <LanguageIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  <a style={{ color: 'rgba(0, 0, 0, 0.87)' }} href={company.website} target="_blank" rel="noopener noreferrer">
                    {company.website}
                  </a>
                </Typography>
              </Box>
            )}
          </Box>

          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Company details tabs"
            sx={{
              mt: 2,
              overflowX: 'auto',
              '@media (max-width: 920px)': {
                width: '50vh',
              },
              '@media (max-width: 480px)': {
                width: '35vh',
              },
            }}
          >
            <Tab value="admins" label="Admins" />
            <Tab value="assistants" label="Assistants" />
            <Tab value="offices" label="Virtual Offices" />
            <Tab value="subscription" label="Subscriptions" />
            <Tab value="data-collections" label="Data Collections" />
            <Tab value="summaries" label="Conversation Summaries" />
             <Tab value="features" label="Features" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Panels */}
      <Card mt={3}>
        <CardContent sx={{ px: 2 }}>
          {value === 'admins' && <AdminList companyId={companyId} role="admin" />}
          {value === 'assistants' && <AssistantList companyId={companyId} />}
          {value === 'offices' && <VirtualOfficeList companyId={companyId} />}
          {value === 'subscription' && <SubscriptionList companyId={companyId} />}
          {value === 'data-collections' && <DataCollectionList companyId={companyId} />}
          {value === 'summaries' && <Summaries companyId={companyId} />}
          {value === 'features' && <FeaturesList companyId={companyId} />} {/* New Panel for Features */}
        </CardContent>
      </Card>
    </Box>
  );
}
