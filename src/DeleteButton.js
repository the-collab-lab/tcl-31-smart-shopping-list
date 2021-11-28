import { doc, deleteDoc } from '@firebase/firestore';
import { db } from './lib/firebase.js';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteButton({ id }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'shopping-list', id));
    }
  };

  return (
    <IconButton
      aria-label="delete"
      size="large"
      onClick={() => handleDelete(id)}
    >
      <DeleteIcon />
    </IconButton>
  );
}
