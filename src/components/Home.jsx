import { useState } from 'react'
import Auth from './Auth';
import Cookies from 'universal-cookie';
import Chat from './Chat';
import {signOut} from 'firebase/auth'
import { auth } from '../firebase-config';
import PostUpload from './PostUpload';
import Posts from './Posts';
import { Route, Routes, Link } from 'react-router-dom';
const cookies = new Cookies();

const Home = () => {

    const [isAuth, setIsAuth] = useState(cookies.get("auth-token")); 

const signUserOut = async() =>{
  await signOut(auth);
  cookies.remove("auth-token");
  setIsAuth(false);
}
 
    return ( 
        <>
         {!isAuth && <div>
        <Auth setIsAuth={setIsAuth} />
      </div>}
      {isAuth && <div className='w-full bg-white font-body'>

    

          <div className='flex md:flex-row flex-col justify-between '>
  
          <div className='items-center   flex h-32 md:h-screen w-screen md:w-52  justify-center bg-white'>
           <div className='md:fixed flex flex-col md:flex-row h-full justify-center items-center gap-3 text-center w-52 px-3 font-body '>
            <div>
              <Link to="/" >H</Link>
            </div>
             <div className='flex md:flex-colw-full'>
              <h2 className='text-md md:text-xl text-center'>Welcome to MeetUp {auth.currentUser.displayName} ! </h2>
              
             </div>
             
           </div>
          </div>
  

              <div className=''>
                <Posts />
              </div>
  
                <div className='w-80 hidden md:block '>
                      <Chat />
               </div>
              
          </div >
          

        </div>}
        </>
     );
}
 
export default Home;