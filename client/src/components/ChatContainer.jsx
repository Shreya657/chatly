import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatDate } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Bot, Send, Image as ImageIcon, MoreVertical, ChevronLeft, 
  Trash2, XCircle, Sparkles, UserCircle, X, Check, CheckCheck 
} from 'lucide-react';

const ChatContainer = ({ isProfileOpen, setIsProfileOpen }) => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, clearChat, chatAi, typingUser } = useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const scrollEnd = useRef();
  const isAi = selectedUser?._id === import.meta.env.VITE_AI_BOT_ID;

  //  TYPING
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      socket.emit("typing", { receiverId: selectedUser._id });
    } else {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
  };

  //  IMAGE PREVIEW
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "" && !imagePreview) return;

    const text = input.trim();
    const image = imagePreview;

    // Reset local states
    setInput(""); 
    setImagePreview(null);
    socket.emit("stopTyping", { receiverId: selectedUser._id });

    if (isAi) {
      await chatAi({ text });
    } else {
      await sendMessage({ text, image });
    }
  };

  useEffect(() => {
    if (selectedUser) {
        getMessages(selectedUser._id);
        // Inform backend/sender that we opened this chat
        socket.emit("markMessagesSeen", { senderId: selectedUser._id });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4 bg-white/[0.01] max-md:hidden'>
        <div className='p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-bounce'>
          <Bot className='w-12 h-12 text-emerald-400' />
        </div>
        <p className='text-xl text-slate-300 font-medium tracking-tight'>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col h-full relative overflow-hidden bg-transparent'>
      
      {/* HEADER  */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md z-10'>
        <div className='flex items-center gap-3'>
          <button onClick={() => setSelectedUser(null)} className='md:hidden p-1 text-slate-400'>
            <ChevronLeft />
          </button>
          <div className='relative'>
            <img src={selectedUser.profilePic || "/vite.svg"} alt="" className='w-10 h-10 rounded-full object-cover border border-white/10' />
            {onlineUsers.includes(selectedUser._id) && (
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0f1e] rounded-full' />
            )}
          </div>
          <div>
            <h3 className='text-white font-semibold text-sm md:text-base flex items-center gap-2'>
              {selectedUser.fullName}
              {isAi && <Sparkles className='w-3 h-3 text-emerald-400' />}
            </h3>
            {/* TYPING & LAST SEEN */}
           <p className='text-[10px] md:text-xs uppercase tracking-widest'>
  {typingUser === selectedUser._id ? (
    <span className='text-emerald-400 font-bold animate-pulse'>Typing...</span>
  ) : onlineUsers.includes(selectedUser._id) || isAi ? (
    <span className='text-emerald-500/70'>Active Now</span>
  ) : (
 <span className='text-slate-500'>
      {selectedUser.lastSeen 
        ? `Last seen ${formatDate(selectedUser.lastSeen)}` 
        : "Last seen recently"}
    </span>


  )}
</p>

          </div>
        </div>

        {/* MENU  */}
        <div className='relative'>
          <button onClick={() => setMenuOpen(!menuOpen)} className='p-2 text-slate-400 hover:text-white transition-colors'>
            <MoreVertical className='w-5 h-5' />
          </button>
          {menuOpen && (
            <div className='absolute right-0 top-full mt-2 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl z-50 p-2'>
              {!isAi && (
                <>
                  <button onClick={() => { setIsProfileOpen(!isProfileOpen); setMenuOpen(false); }} className='w-full flex items-center gap-2 p-2.5 text-sm text-slate-300 hover:bg-white/5 rounded-lg'>
                    <UserCircle className='w-4 h-4 text-emerald-400' /> {isProfileOpen ? 'Hide Profile' : 'View Profile'}
                  </button>
                  <div className='my-1 border-t border-white/5' />
                </>
              )}
              <button onClick={() => { setSelectedUser(null); setMenuOpen(false); }} className='w-full flex items-center gap-2 p-2.5 text-sm text-slate-300 hover:bg-white/5 rounded-lg'>
                <XCircle className='w-4 h-4' /> Close Chat
              </button>
              <div className='my-1 border-t border-white/5' />
              <button onClick={() => { clearChat(); setMenuOpen(false); }} className='w-full flex items-center gap-2 p-2.5 text-sm text-red-400 hover:bg-red-400/10 rounded-lg'>
                <Trash2 className='w-4 h-4' /> Clear Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar'>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;
          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isMe && (
                <img src={selectedUser.profilePic || "/vite.svg"} className='w-6 h-6 rounded-full mb-1 opacity-60' alt="" />
              )}
              
              <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.image ? (
                  <div className="relative group">
                    <img 
                      src={msg.image} 
                      alt="Sent" 
                      onClick={() => window.open(msg.image, "_blank")}
                      className='rounded-2xl border border-white/10 shadow-2xl max-w-full max-h-72 object-cover cursor-zoom-in hover:opacity-90 transition-opacity' 
                    />
                  </div>
                ) : (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    isMe 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                )}
                
                {/* SEEN/DELIVERED */}
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className='text-[9px] text-slate-500'>{formatDate(msg.createdAt)}</span>
                  {isMe && !isAi && (
                    <div className="flex items-center">
                      {msg.seen ? (
                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Check className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isMe && (
                <img src={authUser.profilePic || "/vite.svg"} className='w-6 h-6 rounded-full mb-1 opacity-60' alt="" />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* INPUT AREA WITH IMAGE PREVIEW */}
      <div className="relative px-4 md:px-6">
        {imagePreview && (
          <div className="absolute bottom-full left-6 mb-2 animate-in slide-in-from-bottom-2 duration-200">
            <div className="relative group">
              <img src={imagePreview} className="w-32 h-32 object-cover rounded-2xl border-2 border-emerald-500 shadow-2xl" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className='pb-4 md:pb-6 bg-transparent'>
          <div className='flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all shadow-inner'>
            <input 
              type="text" 
              value={input}
              onChange={handleInputChange}
              placeholder={isAi ? 'Ask Chatly AI anything...' : 'Message...'}
              className='flex-1 bg-transparent border-none text-white p-2 text-sm focus:outline-none placeholder:text-slate-600'
            />
            
            <div className='flex items-center gap-1'>
              {!isAi && (
                <>
                  <input onChange={handleImageSelect} type="file" id='image' accept='image/*' hidden />
                  <label htmlFor="image" className='p-2 text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors'>
                    <ImageIcon className='w-5 h-5' />
                  </label>
                </>
              )}
              <button 
                type="submit"
                disabled={!input.trim() && !imagePreview}
                className='p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 disabled:opacity-30 transition-all shadow-lg shadow-emerald-500/20'
              >
                <Send className='w-4 h-4' />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;