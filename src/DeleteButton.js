import { doc, deleteDoc } from '@firebase/firestore';
import { db } from './lib/firebase.js';
import fetchItems from './utils/fetchItems.js';

export default function DeleteButton({ id, setItems }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, 'shopping-list', id));

      const token = localStorage.getItem('token');
      const items = await fetchItems(token);

      setItems(items);
    }
  };

  return <button onClick={() => handleDelete(id)}>Delete</button>;
}
