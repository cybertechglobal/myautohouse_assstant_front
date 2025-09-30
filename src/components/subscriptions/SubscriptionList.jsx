import React, { useState } from 'react';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';

import useCustomQuery from '../../hooks/useCustomQuery';
import useCustomMutation from '../../hooks/useCustomMutation';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../../api/subscriptions';

import { getPackages } from '../../api/packages';

import { subscriptionSchema } from '../../schemas/subscription';
import Loading from '../common/loading/loading';
import SectionHeader from '../common/page-header/SectionHeader';
import NoData from '../common/no-data/NoData';
import DeleteDialog from '../common/delete-dialog/DeleteDialog';

export default function SubscriptionList({ companyId }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm());
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: subscriptions = [], isLoading, refetch } = useCustomQuery({
    queryKey: ['subscriptions', { company_id: companyId }],
    queryFn: () => getSubscriptions(companyId),
  });

  const { data: packages = [], isLoading: isLoadingPackages } = useCustomQuery({
    queryKey: ['packages'],
    queryFn: () => getPackages(),
  });

  const createMutation = useCustomMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const updateMutation = useCustomMutation({
    mutationFn: ({ subscriptionId, data }) => updateSubscription({ subscriptionId, data }),
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });


  const deleteMutation = useCustomMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => refetch(),
  });

  function initialForm() {
    return {
      start_date: '',
      end_date: '',
      type: 'basic',
      package_id: '',
    };
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async () => {
    try {
      const validatedData = await subscriptionSchema.validate(form, {
        abortEarly: false,
      });

      const isEdit = !!editingId;
      const data = {
        ...validatedData,
        company_id: companyId,
        package_id: form.package_id || null,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ subscriptionId: editingId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (validationError) {
      if (validationError.inner) {
        const formErrors = validationError.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setErrors(formErrors);
      }
    }
  };

  const handleEdit = (sub) => {
    setForm({
      start_date: moment(sub.start_date).format('YYYY-MM-DD'),
      end_date: moment(sub.end_date).format('YYYY-MM-DD'),
      type: sub.type,
      package_id: sub.package_id || '', // dodaj ovu liniju
    });
    setEditingId(sub.id);
    setErrors({});
    setOpen(true);
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm());
    setEditingId(null);
    setErrors({});
  };

  return (
    <Box>
      <SectionHeader
        title="Subscriptions"
        isSmallTitle={true}
        buttonText="Add Subscription"
        onButtonClick={() => setOpen(true)}

      />
      {isLoading ? (
        <Loading />
      ) : (
        [...subscriptions]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((sub) => (
            <Card key={sub.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: sub.type === 'premium' ? '#FF9800' : '#2196F3' }}>
                  Type: {sub.type}
                </Typography>
                <Typography
                  style={{
                    color:
                      sub.status === 'active' ? 'green' :
                        sub.status === 'cancelled' ? 'red' :
                          sub.status === 'expired' ? 'gray' :
                            sub.status === 'inactive' ? '#FFA500' :
                              'black'
                  }}
                >
                  Status: {sub.status}
                </Typography>
                <Typography>
                  {moment(sub.start_date).format('DD.MM.YYYY')} →{' '}
                  {moment(sub.end_date).format('DD.MM.YYYY')}
                </Typography>
                {sub.package && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Package Details:
                    </Typography>
                    <Typography>
                      Name: {sub.package.name}
                    </Typography>
                    <Typography>
                      Conversations Limit: {sub.package.conversations_limit}
                    </Typography>
                    <Typography>
                      Price: {sub.package.price}
                    </Typography>
                  </Box>

                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  Conversations count: {sub.conversations_count}
                </Typography>
                {sub.package?.conversations_limit != null && sub.conversations_count != null && (
                  <Typography variant="subtitle1" fontWeight="bold">
                    Remaining conversations: {Math.max(0, sub.package.conversations_limit - sub.conversations_count)}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {sub.status !== 'cancelled' && (<IconButton onClick={() => handleEdit(sub)} color='primary' size='small'>
                  <Edit sx={{ mr: 1 }} /> Edit
                </IconButton>)}

                <IconButton onClick={() => handleDelete(sub.id)} color='error' size='small'>
                  {sub.status === 'cancelled' ? (
                    <>
                      <Delete sx={{ mr: 1 }} /> Delete
                    </>
                  ) : (
                    <>
                      <CancelIcon sx={{ mr: 1 }} /> Cancel
                    </>
                  )}
                </IconButton>
              </CardActions>
            </Card>
          ))
      )}
      {!subscriptions.length && <NoData message='No active subscription!' actionText='Add Subscription' onAction={() => setOpen(true)} />}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Subscription' : 'Add Subscription'}
        </DialogTitle>
        <DialogContent>
          <TextField
            size='small'
            name="start_date"
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.start_date}
            onChange={handleChange}
            error={!!errors.start_date}
            helperText={errors.start_date}
          />
          <TextField
            size='small'
            name="end_date"
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.end_date}
            onChange={handleChange}
            error={!!errors.end_date}
            helperText={errors.end_date}
          />
          <TextField
            size='small'
            name="type"
            label="Type"
            select
            fullWidth
            margin="normal"
            value={form.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
          >
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
          </TextField>
          <TextField
            size='small'
            name="package_id"
            label="Package"
            select
            fullWidth
            margin="normal"
            value={form.package_id}
            onChange={handleChange}
            error={!!errors.package_id}
            helperText={errors.package_id}
          >
            {packages.data?.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.conversations_limit} conversations - {pkg.price} price)
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='text' onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Cancel Subscription"
        content="Are you sure you want to cancel this subscription?"
      />
    </Box>
  );
}
