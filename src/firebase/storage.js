import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

export const uploadProductImage = async (file, folder = 'products') => {
  const fileRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};
