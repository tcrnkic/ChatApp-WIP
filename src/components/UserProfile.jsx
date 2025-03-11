import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import EditProfileModal from "./EditProfileModal";
import PostUpload from "./PostUpload";
import UploadPostModal from "./UploadPostModal";

const UserProfile = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userCollectionRef = collection(db, 'users');
        const userQuery = query(userCollectionRef, where('uid', '==', uid));
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userData = userQuerySnapshot.docs[0].data();
          setUserData(userData);
          setIsCurrentUser(auth.currentUser && auth.currentUser.uid === uid);
        } else {
          console.log('User not found for', uid);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    const fetchUserPosts = () => {
      const postsRef = collection(db, 'posts');
      const userPostsQuery = query(postsRef, where('uid', '==', uid), orderBy('createdAt'));

      const unsubscribe = onSnapshot(userPostsQuery, (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(newPosts);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchUserData();
    fetchUserPosts();
  }, [uid]);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => setUploadModalOpen(false);

  const handleEditProfile = (newData) => {
    // Implement logic to update user data in Firebase
    console.log("Updating user data:", newData);
    // Close the modal
    closeEditModal();
  };

  const signUserOut = async() =>{
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
  }
   
  return (
    <div className="md:max-w-[750px] mx-auto p-4 bg-white shadow-md rounded-md my-8">
      {userData ? (
      <>      <div>
          
          <div className="flex  justify-between items-center mb-4 ">
             <div className="flex">
            <img src={userData.photoURL} alt="pfp" className="w-16 h-16 rounded-full mr-4" />
           
             <div>
               <h2 className="text-xl font-bold">{userData.displayName}</h2>
               <p className="text-gray-600">@{userData.nickname}</p>
             </div>
            </div>

            {isCurrentUser && 
            <div className="">
            <button
                onClick={openEditModal}
                className="bg-blue-500  text-white px-4 py-2 rounded-md mt-4 ml-6"
              >
                Edit Profile
              </button>
              <button onClick={signUserOut} className='bg-red-500 text-white px-4 py-2 rounded-lg mt-4 ml-6  '>Sign Out</button>
              </div>
}             
          </div>
          <p className="text-gray-700 mb-4 max-w-[400px]">{userData.bio}</p>
         
          <hr />
 
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4"> Posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  2xl:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <div key={post.id} className="bg-gray-100 rounded-lg overflow-hidden">
                  <img className="w-full h-72 object-cover" src={post.imageUrl} alt="Post Picutre" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{post.user}</h3>
                    <p className="text-gray-700">{post.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
                 {isCurrentUser && (
            <div className="flex items-center justify-center">
             <button onClick={openUploadModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8" >Upload Post</button>
        
            </div>
          )}
       
                
        </div>


        </>

      ) : (
        <p>Loading...</p>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          userId={uid}
          initialBio={userData.bio}
          initialNickname={userData.nickname}
          userName={userData.displayName}
          userEmail={userData.email}
          onEditProfile={handleEditProfile}
        />
      )}

      {isUploadModalOpen && (
        <UploadPostModal
        isOpen={isUploadModalOpen}
        requestClose={closeUploadModal}
        />
      )}
    </div>
  );
};

export default UserProfile;
