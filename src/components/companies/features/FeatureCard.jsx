import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FeatureCard({ feature, onEdit, onDelete }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{feature.feature.name}</Typography>
        <Typography variant="body2" color="text.secondary">{feature.feature.description}</Typography>
        <Typography variant="body2" color="text.secondary">{`Price: ${feature.price}`}</Typography>
        <Typography variant="body2" color="text.secondary">{`Billing Type: ${feature.billing_type}`}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(feature)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(feature)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
