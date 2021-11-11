import { collection, query, where, getDocs } from '@firebase/firestore';
import { db } from '../lib/firebase.js';

export default async function fetchItems(token) {
  const response = collection(db, 'shopping-list');
  const itemList = query(response, where('userToken', '==', token));

  const querySnapshot = await getDocs(itemList);
  return querySnapshot.docs.map((doc) => {
    const {
      name,
      userToken,
      lastPurchasedDate,
      previousEstimate,
      totalPurchases,
      days,
    } = doc.data();
    const id = doc.id;
    return {
      id,
      name,
      userToken,
      lastPurchasedDate,
      previousEstimate,
      totalPurchases,
      days,
    };
  });
}
