import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { 
  MessageSquareText, 
  MoreVertical, 
  Search, 
  LogOut, 
  UserCircle, 
  Sparkles,
  
} from 'lucide-react';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const filteredUsers = input 
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) 
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className={`bg-white/[0.03] backdrop-blur-xl h-full p-5 border-r border-white/10 flex flex-col transition-all duration-300 ${selectedUser ? "max-md:hidden" : "w-full md:w-80"}`}>
      
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-emerald-500/20 rounded-lg'>
            <MessageSquareText className='w-6 h-6 text-emerald-400' strokeWidth={2} />
          </div>
          <h1 className='text-white font-bold text-xl tracking-tight hidden md:block'>Chatly</h1>
        </div>
        
        <div className='relative'>
          <button 
            onClick={() => setOpen(!open)}
            className='p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white'
          >
            <MoreVertical className='w-5 h-5' />
          </button>
          
          {open && (
            <div className='absolute top-full right-0 z-50 w-40 mt-2 p-2 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
              <button 
                onClick={() => navigate('/profile')} 
                className='w-full flex items-center gap-2 p-3 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors'
              >
                <UserCircle className='w-4 h-4' /> Edit Profile
              </button>
              <div className='my-1 border-t border-white/5' />
              <button 
                onClick={() => logout()} 
                className='w-full flex items-center gap-2 p-3 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors'
              >
                <LogOut className='w-4 h-4' /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className='relative group mb-4'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors' />
        <input 
          onChange={(e) => setInput(e.target.value)} 
          type="text" 
          className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600' 
          placeholder='Search users...'
        />
      </div>

      {/* AI  BUTTON */}
      <button
       onClick={() => setSelectedUser({ 
    _id: import.meta.env.VITE_AI_BOT_ID, 
    fullName: "Chatly AI", 
    profilePic: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Chatly&backgroundColor=059669,0891b2" 
})}
        className={`flex items-center justify-center gap-2 w-full py-3 mb-6 rounded-xl font-medium transition-all active:scale-95 shadow-lg ${
          selectedUser?._id === import.meta.env.VITE_AI_BOT_ID 
          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
          : 'bg-gradient-to-r from-emerald-500/20 to-cyan-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Chat with AI</span>
      </button>

      {/* USER LIST */}
      <div className='flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar'>
        {filteredUsers.map((user, index) => {
          const isOnline = (onlineUsers || []).includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <div 
              onClick={() => {
                setSelectedUser(user); 
                setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
              }} 
              key={index} 
              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                isSelected ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
              }`}
            >
              {/* Profile Pic & Online Indicator */}
              <div className='relative'>
                <img 
                  src={user?.profilePic || "https://imgs.search.brave.com/XLM6WQZOOjg4USteTMmA56CbGwKhBGOcLHTpbDno-xU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE3/MTM4MjYzMy92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tYW5v/bnltb3VzLXBlcnNv/bi1zeW1ib2wtYmxh/bmstYXZhdGFyLWdy/YXBoaWMtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9WndPRjZOZk9S/MHpoWUM0NHhPWDA2/cnlJUEFVaER2QWFq/clBzYVo2djEtdz0"} 
                  alt={user.fullName} 
                  className={`w-11 h-11 rounded-full object-cover border-2 ${isSelected ? 'border-emerald-500/50' : 'border-transparent'}`}
                />
                {isOnline && (
                  <div className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full' />
                )}
              </div>

              {/* User Info */}
              <div className='flex-1 overflow-hidden'>
                <p className={`font-medium truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {user.fullName}
                </p>
                <p className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isOnline ? 'online' : 'offline'}
                </p>
              </div>

              {/* Unseen Counter */}
              {unseenMessages[user._id] > 0 && (
                <div className='bg-emerald-500 text-white text-[10px] font-bold h-5 w-5 flex justify-center items-center rounded-full shadow-lg animate-bounce'>
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Sidebar;