import React, { useContext, useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const Home = () => {
    const { selectedUser } = useContext(ChatContext)
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        if (!selectedUser || selectedUser._id === import.meta.env.VITE_AI_BOT_ID) {
            setIsProfileOpen(false);
        }
    }, [selectedUser]);

    return (
        <div className='w-full h-screen sm:px-[10%] sm:py-[5%] bg-[#0a0f1e] overflow-hidden'>
            <div className='flex w-full h-full backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative'>
                
                <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-[320px] flex-shrink-0 h-full`}>
                    <Sidebar />
                </div>

                <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 h-full bg-white/[0.01]`}>
                    <ChatContainer 
                        isProfileOpen={isProfileOpen} 
                        setIsProfileOpen={setIsProfileOpen} 
                    />
                </div>

{isProfileOpen && selectedUser && selectedUser._id !== import.meta.env.VITE_AI_BOT_ID && (
    <div className={`fixed inset-0 z-[100] md:inset-auto md:right-0 md:relative flex w-full md:w-[350px] xl:w-[300px] flex-shrink-0 h-full bg-[#0a0f1e] border-l border-white/5  animate-in slide-in-from-right duration-300`}>
        <RightSidebar setIsProfileOpen={setIsProfileOpen} />
    </div>
)}

            </div>
        </div>
    );
}

export default Home