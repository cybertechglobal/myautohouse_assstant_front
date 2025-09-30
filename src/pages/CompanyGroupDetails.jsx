import React from 'react';
import { useParams } from 'react-router-dom';

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


import useCustomQuery from '../hooks/useCustomQuery';

import { getCompanyGroup } from '../api/companyGroups'

import AdminList from '../components/admins/AdminList';
import CompanyList from '../components/companies/CompanyList';
import Loading from '../components/common/loading/loading';

export default function CompanyGroupDetails() {
  const { companyGroupId } = useParams();
  
  const {
    data: companyGroup,
    isLoading,
    error,
  } = useCustomQuery({
    queryKey: ['companyGroup', companyGroupId],
    queryFn: () => getCompanyGroup(companyGroupId),
  });

  const [value, setValue] = React.useState('admins');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) return <Loading/>;
  if (error) return <Typography>Error loading company details</Typography>;

  return (
    <Box p={4}>
      <Card sx={{ mb: 4, pb: 0, borderBottom: 'none' }}>
        <CardContent sx={{ paddingBottom: '0 !important' }}>
          <Box display="flex" flexDirection="column" gap={1}>
            {companyGroup.logo_url && (
              <Box mb={1}>
                <img
                  src={companyGroup.logo_url}
                  alt={`${companyGroup.name} logo`}
                  style={{ width: 120, height: 'auto', borderRadius: 8 }}
                />
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5" fontWeight={600}>
                {companyGroup.name}
              </Typography>
            </Box>

            {companyGroup.description && (
              <Typography variant="body2" color="text.secondary">
                {companyGroup.description}
              </Typography>
            )}

            {companyGroup.address && (
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {companyGroup.address}
                  {companyGroup.city ? `, ${companyGroup.city}` : ''} {companyGroup.postal_code || ''}
                  {companyGroup.country ? `, ${companyGroup.country}` : ''}
                </Typography>
              </Box>
            )}

            {companyGroup.createdAt && (
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  Founded: {new Date(companyGroup.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            {companyGroup.email && (
              <Box display="flex" alignItems="center" gap={1}>
                <MailOutlineIcon fontSize="small" color="primary" />
                <Typography variant="body2">{companyGroup.email}</Typography>
              </Box>
            )}

            {companyGroup.phone && (
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body2">{companyGroup.phone}</Typography>
              </Box>
            )}

          </Box>

          {/* Tabs */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="primary tabs example"
          >
            <Tab value="admins" label="Admins" />
            <Tab value="companies" label="Auto Houses" />
          </Tabs>
        </CardContent>
      </Card>


      {/* Tab Panels */}
      <Card mt={3}>
        <CardContent sx={{ px: 2 }}>
          {value === 'admins' && <AdminList companyGroupId={companyGroupId} role='group-admin' />}
          {value === 'companies' && <CompanyList />}
        </CardContent>
      </Card>

    </Box>


  );
}
