import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const { user } = result;

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: 'user',
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return result;
};

export const logOut = () => signOut(auth);
