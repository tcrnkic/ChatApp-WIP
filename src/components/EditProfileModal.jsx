import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';


Modal.setAppElement('#root'); 

const EditProfileModal = ({ isOpen, onRequestClose, userId, initialBio, initialNickname, userName, userEmail }) => {
  const [bio, setBio] = useState(initialBio);
  const [nickname, setNickname] = useState(initialNickname);
  const [userDocId, setUserDocId] = useState(null);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userCollectionRef = collection(db, 'users');
        const userQuery = query(userCollectionRef, where('uid', '==', userId));
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userDocId = userQuerySnapshot.docs[0].id;
          setUserDocId(userDocId);
        } else {
          console.log('User not found for', userId);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    try {
      if (!userDocId) {
        console.error('User document ID not found.');
        return;
      }

      const userRef = doc(db, 'users', userDocId);

      await updateDoc(userRef, {
        bio,
        nickname,
      });

      onRequestClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} >
     <div className='flex flex-col justify-start w-[50%] gap-4 font-body relative h-full '>
         <h2 className='text-4xl' >Edit Profile</h2>

         <label className='flex flex-col'>
          User:
          <input type="text" value={name} readOnly className='bg-gray-100 rounded-lg px-2 py-1 w-36'  />
         </label>

         <label className='flex flex-col'>
          Email:
          <input type="text" value={email} readOnly className='bg-gray-100 rounded-lg px-2 py-1 w-80 '  />
         </label>

         <label className='flex flex-col'>
           Bio:
           <textarea value={bio} className='bg-gray-100 rounded-lg px-2 py-1 ' onChange={(e) => setBio(e.target.value)} />
         </label>

         <label className='flex flex-col'>
           Nickname:
           <input type="text" value={nickname} maxLength={12} className='bg-gray-100 rounded-lg px-2 py-1 w-32' onChange={(e) => setNickname(e.target.value)} />
         </label>
<div className='flex flex-col items-start gap-3 absolute bottom-3 '>
             <button onClick={handleSave} className='bg-blue-600 text-white py-1 rounded-lg w-28'>Save</button>
             <button onClick={onRequestClose} className='bg-red-500 text-white py-1 rounded-lg w-28'>Cancel</button>
</div>
     </div>
    </Modal>
  );
};

export default EditProfileModal;
