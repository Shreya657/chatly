import React, { useContext, useEffect, useRef, useState } from 'react'
import { messagesDummyData } from '../assets/assets'
import { formatDate } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
    const { messages,selectedUser,setSelectedUser,sendMessage,setMessages,getMessages,clearChat,chatAi}=useContext(ChatContext)
    const {authUser,onlineUsers }=useContext(AuthContext)
const[menuOpen,setMenuOpen]=useState(false);


    const scrollEnd = useRef()


    const [input,setInput]=useState('');


    //handle sending a message
    const handleSendMessage=async(e)=>{
        e.preventDefault();
          if (input.trim() === "") return null;
      if (selectedUser._id === import.meta.env.VITE_AI_BOT_ID) {
    await chatAi({ text: input.trim() });
  } else {
    await sendMessage({ text: input.trim() });
  }
        setInput("");
    }

   


    //handle sending an image
    const handleSendImage=async(e)=>{
        const file=e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("select an image file")
            return;
        }
        const reader=new FileReader();
        reader.onloadend=async()=>{
            await sendMessage({image:reader.result});
            e.target.value=""
        }
        reader.readAsDataURL(file)
    }



    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({behavior:"smooth"})
        }
    },[messages])
  return selectedUser? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
        {/* ---------header */}
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
            <img  src={selectedUser.profilePic || "./vite.svg"} alt="profilepic"  className='w-8 rounded-full'/>
            <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullName}
           {onlineUsers.includes(selectedUser._id) &&     <span className='w-2 h-2 rounded-full bg-green-500'></span>}
            </p>
            <img onClick={()=>setSelectedUser(null)} src='./vite.svg' alt="" className='md:hidden max-w-7' />
            <div>
           
            <img onClick={() => setMenuOpen(!menuOpen)} src="https://imgs.search.brave.com/tXIQpiSY89u8Q8Wca_q_3T4cxZxpYzrs0Vu48MqdVjM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS8x/MjgvMzc0OC8zNzQ4/NzkzLnBuZw"  alt="" className='max-md:hidden max-w-5' />
                  {menuOpen && (
    <div className="absolute right-0 top-6 bg-gray-800 p-2 rounded shadow">
      <button
        onClick={clearChat}
        className="text-white text-sm px-2 py-1 hover:bg-gray-700 rounded"
      >
        Clear Chat
      </button>
    </div>
  )}
            </div>
        </div>
        {/* ------------chat area */}
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
            {messages.map((msg,index)=>(
                <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId!==authUser._id && 'flex-row-reverse'}`}>
                    {msg.image ?(
                        <img src={msg.image} alt="message" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                    ):(
                        <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId===authUser._id ? 'rounded-br-none':'rounded-bl-none'}`} >{msg.text}</p>

                    )}

                    <div className='text-center text-xs'>
                        <img src={msg.senderId===authUser._id ? authUser?.profilePic || "./vite.svg"  : selectedUser?.profilePic || 'https://pbs.twimg.com/media/G1YCqAlWAAATCnx?format=jpg&name=large'} alt="" className='w-7 rounded-full' />
                        <p className='text-gray-400'>{ formatDate(msg.createdAt)}</p>
                    </div>

                    </div>
            ))}
            <div ref={scrollEnd}></div>
        </div>

        {/* ---------input area */}
        <div className='absolute bottom-0 left-0 right-0 p-3 gap-3  flex items-center'>
            <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
               <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key==="Enter" ? handleSendMessage(e): null} type="text" placeholder='send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'  /> 
               <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/svg' hidden />
                {   (selectedUser._id !== import.meta.env.VITE_AI_BOT_ID) && <label htmlFor="image" >
              <img src="https://imgs.search.brave.com/fMJtsjKsXEw2TPfTpXyhfVFWsRQUM3vRzke3cFIAqGc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jYW1l/cmEtaWNvbi1waG90/by1jYW1lcmEtaWNv/bi1jYW1lcmEtaWNv/bi1waG90by1jYW1l/cmEtaWNvbi12ZWN0/b3ItMzc1NDUxOTIz/LmpwZw" alt="" className='w-5 mr-2 cursor-pointer' />
                </label>}
            </div>
    <svg
  onClick={handleSendMessage}
  xmlns="http://www.w3.org/2000/svg"
  fill="white"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="black"
  className="w-7 h-7 cursor-pointer"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
  />
</svg>


        </div>
    </div>
  ):
  (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src="./vite.svg" alt="" className='w-20' />
        <p className='text-lg  text-while font-bold'>chat anytime,anywhere</p>
    </div>
  )
}

export default ChatContainer
