import { useEffect, useRef, useState } from 'react';
import {auth, db} from '../firebase-config'
import {addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, where, getDocs} from 'firebase/firestore'
import { Link } from 'react-router-dom';


const Chat = () => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userNicknames, setUserNicknames] = useState({});

    const messagesEndRef = useRef();

    const messagesRef = collection(db, "messages");
    const usersRef = collection(db, 'users');

    useEffect(()=>{ 
        const queryMeessages = query(messagesRef, orderBy("createdAt"))
        const unsubscribe = onSnapshot(queryMeessages, (snapshot)=>{
            let messages = [];
            snapshot.forEach((doc)=>{
                    messages.push({...doc.data(), id: doc.id});
            });
            setMessages(messages);
            console.log(messages);
            console.log(auth)
        })
        return () => unsubscribe();
    },[])

 

    useEffect(() => {
        const fetchUserNicknames = async () => {
          const nicknames = {};
          for (const message of messages) {
            if (!userNicknames[message.uid]) {
              try {
                const userQuery = query(usersRef, where('uid', '==', message.uid));
                const userQuerySnapshot = await getDocs(userQuery);
    
                if (!userQuerySnapshot.empty) {
                  nicknames[message.uid] = userQuerySnapshot.docs[0].data().nickname;
                } else {
                  console.log('User not found for UID:', message.uid);
                  nicknames[message.uid] = ''; // Set a default value
                }
              } catch (error) {
                console.error('Error fetching user data:', error);
                nicknames[message.uid] = ''; // Set a default value
              }
            }
          }
          setUserNicknames((prev) => ({ ...prev, ...nicknames }));
        };
        
        const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        scrollToBottom();
        fetchUserNicknames();
      }, [messages]);



      const getNickname = (uid) => {
        return userNicknames[uid] || 'Anonymous';
      };




    const handleSubmit = async(e) =>{
        e.preventDefault();
        if(newMessage === ""){return;}

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            pfp: auth.currentUser.photoURL,
            uid: auth.currentUser.uid
        });
        console.log(auth);
        setNewMessage("");
    }

    return (
        <div className='hidden sm:flex flex-col items-center bg-slate-50   h-screen  right-0 fixed'>
          <div className='bg-white shadow-md px-4 py-2 w-full '>
            <h2 className='text-lg font-semibold'>Chat</h2>
          </div>
            <div className='w-80 2xl:w-96 h-full overflow-scroll overflow-x-hidden custom-scrollbar ps-4  '>
            {messages.map((message) => (
                   <div key={message.id} className={`p-2 flex flex-col mb-4 mt-2  rounded-lg text-gray-700 ${message.uid === auth.currentUser.uid ? 'items-end bg-gray-300' : 'items-start bg-blue-400 text-white'}`}>
                  <div className={`flex ${message.uid === auth.currentUser.uid ? 'flex' : 'flex-row-reverse'}  gap-2 items-center`}>
                     <h1 className='text-md'> {getNickname(message.uid) != 'Anonymous' ? getNickname(message.uid) : message.user} </h1>
                     <Link to={`/profile/${message.uid}`}>
                      <img src={message.pfp} alt="profile picture" className='size-7 rounded-full' /> 
                     </Link >
                  </div>
                  <h1>{message.text}</h1>
                  </div>
            ))}
            <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={handleSubmit} className='py-2'>
                <input type="text" placeholder='Type your message...'
                 className='bg-gray-300 px-2 py-1 rounded-lg'
                 onChange={(e)=> setNewMessage(e.target.value)}
                 value={newMessage}
                 />
                <button type='submit' className='bg-blue-600 px-2 py-1 text-white rounded-lg mx-3'>Send</button>
            </form>
        </div>
     );
}
 
export default Chat;