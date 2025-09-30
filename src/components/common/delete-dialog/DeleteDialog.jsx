import { Dialog, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';
import DialogHeader from '../dialog-header/DialogHeader';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteDialog({ open, onClose, onConfirm, title, content }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title={title} onClose={onClose}/>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <Divider sx={{ m: 2}}/>
      <DialogActions sx={{ mx: 2}}>
        <Button variant="outlined" color="text" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
