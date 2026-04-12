import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';
import { X, Image as ImageIcon, LogOut } from 'lucide-react';

const RightSidebar = ({ setIsProfileOpen }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [messageImages, setMessageImages] = useState([]);

  useEffect(() => {
    if (messages) {
      setMessageImages(
        messages.filter(msg => msg.image).map(msg => msg.image)
      )
    }
  }, [messages])

  if (!selectedUser) return null;

  return (
    <div className="bg-[#0a0f1e]/80 backdrop-blur-2xl text-white w-full h-full flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Profile</h2>
        <button 
          onClick={() => setIsProfileOpen(false)}
          className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* PROFILE INFO */}
        <div className='pt-8 pb-6 flex flex-col items-center text-center px-6'>
          <div className="relative mb-4">
            <img 
              onClick={() => window.open(selectedUser?.profilePic || './vite.svg')} 
              src={selectedUser?.profilePic || "https://api.dicebear.com/7.x/initials/svg?seed=" + selectedUser.fullName} 
              alt="profile" 
              className='w-24 h-24 rounded-full object-cover border-2 border-emerald-500/30 p-1 cursor-pointer hover:scale-105 transition-transform' 
            />
            {onlineUsers.includes(selectedUser._id) && (
              <span className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0a0f1e]'></span>
            )}
          </div>
          
          <h1 className='text-xl font-bold text-white mb-1'>{selectedUser.fullName}</h1>
          <p className='text-sm text-slate-400 leading-relaxed italic'>
            "{selectedUser?.bio || "Hey there! I'm using Chatly."}"
          </p>
        </div>

        <div className="px-6 py-4">
            <div className='flex items-center gap-2 mb-4 text-emerald-400'>
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Shared Media</span>
            </div>

            {messageImages.length > 0 ? (
                <div className='grid grid-cols-2 gap-2 opacity-90'>
                    {messageImages.map((url, index) => (
                        <div 
                            key={index} 
                            onClick={() => window.open(url)} 
                            className='aspect-square cursor-pointer rounded-lg overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-colors bg-white/5'
                        >
                            <img src={url} alt="Shared media" className='w-full h-full object-cover' />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-xs text-slate-500">No media shared yet</p>
                </div>
            )}
        </div>
      </div>

      {/* LOGOUT*/}
      <div className="p-6">
        <button 
          onClick={() => logout()} 
          className='w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all font-medium text-sm'
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSidebar