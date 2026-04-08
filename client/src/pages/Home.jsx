import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const Home = () => {
    const{selectedUser}=useContext(ChatContext)

    
 return (
  <div className='w-full h-screen sm:px-[10%] sm:py-[5%] bg-[#0a0f1e] overflow-hidden'>
    
    <div className='flex w-full h-full backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative'>
      
      <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-[320px] flex-shrink-0 h-full`}>
        <Sidebar />
      </div>

      <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 h-full bg-white/[0.01]`}>
        <ChatContainer />
      </div>

     {selectedUser && selectedUser._id !== import.meta.env.VITE_AI_BOT_ID && (
    <div className='hidden xl:flex w-[300px] ...'>
      <RightSidebar />
    </div>
  )}

    </div>
  </div>
);
}

export default Home
