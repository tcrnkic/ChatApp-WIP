import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Link } from 'react-router-dom';
const Posts = () => {
    const [posts, setPosts] = useState([]);
 
    useEffect(()=>{
        const postsRef = collection(db, 'posts');
        const queryPosts = query(postsRef, orderBy("createdAt"))
        const unsubscribe = onSnapshot(queryPosts, (snapshot)=>{
            const newPosts = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }));

            setPosts(newPosts);
            console.log(newPosts);
        })

        return () =>{
            unsubscribe();
        }

    },[db])
    return ( 
        <>
        <div className="flex justify-center items-center mt-4">
            <h1 className="text-xl" >All Posts</h1>
        </div>
        <div className="py-8 grid grid-cols-1  md:grid-cols-2 gap-14">
            {posts && posts.map((post)=>(
                <div className="rounded-lg overflow-hidden bg-gray-100 flex flex-col justify-center items-center " key={post.id}>
                 <div>
                       <img className="w-80 h-80 md:size-72 object-cover  " src={post.imageUrl} alt="Post Picutre" />
                     <div className="flex items-center p-2">
                          <img src={post.pfp} alt="profile picture" className='size-7 rounded-full' />
                           <Link to={`/profile/${post.uid}`} >
                             <h2 className="px-2 ">{post.user}</h2>
                             </Link>
                     </div>
                         <h3 className="px-3 pb-3" >{post.text}</h3>
                     
                 </div>
                </div>
            ))}
        </div>
        </>
     );
}
 
export default Posts;
