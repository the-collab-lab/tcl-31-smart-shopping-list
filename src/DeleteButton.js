import { doc, deleteDoc } from '@firebase/firestore';
import { db } from './lib/firebase.js';

export default function DeleteButton({ id }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'shopping-list', id));
    }
  };

  return <button onClick={() => handleDelete(id)}>Delete</button>;
}
