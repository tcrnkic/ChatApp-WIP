import { useState } from 'react'
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';


function App() {


  return (
    <div className='flex '>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="profile/:uid" element={<UserProfile />} />
     </Routes>

    </div>
  )
}

export default App
