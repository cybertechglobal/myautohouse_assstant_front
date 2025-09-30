import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function AdminCard({ admin, onEdit, onDelete }) {

  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'group_admin':
        return 'Group Admin';
      default:
        return role;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {admin.first_name} {admin.last_name}
        </Typography>

        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gutterBottom>
          <EmailIcon fontSize="small" color='primary' sx={{ mr: 0.5 }} /> {admin.email}
        </Typography>

        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
          <AdminPanelSettingsIcon color='primary' fontSize="small" sx={{ mr: 0.5 }} /> {formatRole(admin.role)}
        </Typography>
      </CardContent>

      <Box display="flex" justifyContent="flex-end" p={2} pt={0} gap={1}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(admin)}>
          Edit
        </Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(admin)}>
          Delete
        </Button>
      </Box>
    </Card>
  );
}
