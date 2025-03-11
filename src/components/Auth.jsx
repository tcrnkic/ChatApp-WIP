import {auth, db, provider} from '../firebase-config';
import {signInWithPopup} from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import Cookies from 'universal-cookie';
const Auth = (props) => {

    const {setIsAuth} = props;
    const cookies = new Cookies();
    const signInWithGoogle = async() =>{
        try {
     const result =  await signInWithPopup(auth, provider);
     cookies.set("auth-token", result.user.refreshToken)
            console.log(result);
     if (result._tokenResponse.isNewUser) {
        
        const { uid, displayName, email, photoURL } = result.user;
        console.log("Adding user to Firestore:", { uid, displayName, email });

        const usersRef = collection(db, 'users');

      
        await addDoc(usersRef, {
            displayName,
            email,
            uid,
            bio: "", 
            nickname: "",
            photoURL

        });
 
        console.log("User added to Firestore successfully!");
    }

     setIsAuth(true);
        }
        catch(err) {
            console.log(err);
        }
    }; 

    return ( 
      <div className='flex w-screen items-center font-body h-96 justify-center'>
          <div className='text-center py-20 px-8 rounded-lg bg-slate-100 '> 
          <h1 className='text-2xl my-3'>Welcome to MeetUp!</h1>
              <p>Sign In With Google To Continue</p> 
              <button className='bg-blue-600 text-white font-body my-3 px-4 py-1 rounded-lg' onClick={signInWithGoogle}>Sign In With Google</button>
           </div>
      </div>
     );
}
 
export default Auth;
