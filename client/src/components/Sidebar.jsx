import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { userDummyData } from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useEffect } from 'react';

const Sidebar = () => {
    const[open,setOpen]=useState(false);
    const {getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages}=useContext(ChatContext)
const {logout,onlineUsers}=useContext(AuthContext);
//  console.log("Online users:", onlineUsers); 

const[input,setInput]=useState("");


    const navigate=useNavigate();

    const filteredUsers=input? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) :users;
    useEffect(()=>{
        getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll txt-white ${selectedUser?"max-md:hidden" : ""}`}>
    <div className='pb-5'>
        <div className='flex justify-between items-center'>
            <img src="./vite.svg" alt="logo" className='max-w-40' />
            <div className='relative py-2 group'>
                <img  src="https://imgs.search.brave.com/XB5sf7IYUsahp2F0CIB6GXnYYxaxEHOhAtJsMraRwC4/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9lbGxpcHNp/cy1pY29uLXN2Zy1w/bmctZG93bmxvYWQt/ODI3OTc0OC5wbmc_/Zj13ZWJwJnc9MTI4" alt="menu" onClick={()=>setOpen(!open)} className='max-h-5 cursor-pointer' />
             {open &&  (  <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border-gray-600 text-gray-100 '>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit profile</p>
                    <hr  className='my-2 border-t border-gray-500'/>
                    <p onClick={()=>logout()} className='cursor-pointer text-sm'>Logout</p>
             
                </div>
)}
            </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src="https://img.icons8.com/?size=160&id=g9EI5VZAXxZd&format=png" alt="search"  className='w-3'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text"  className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='search user....'/>
        </div>

        <div className="chat-sidebar-header flex items-center justify-between p-2">
  <button
    onClick={() => setSelectedUser({ 
        _id: import.meta.env.VITE_AI_BOT_ID, 
        fullName: "AI Bot", 
        profilePic: "https://pbs.twimg.com/media/G17Z8zvWoAAUqMY?format=jpg&name=small" 
    })}
    className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700"
  >
    Chat with AI
  </button>
</div>



    </div>
    <div className='flex flex-col'>
        { filteredUsers.map((user,index)=>(
            <div onClick={()=>{setSelectedUser(user); setUnseenMessages(prev=>({...prev,[user._id]:0}))}} key={index}  className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id ===user._id && 'bg-[#282142]/50'}`}>
                <img src={user?.profilePic || "https://imgs.search.brave.com/XLM6WQZOOjg4USteTMmA56CbGwKhBGOcLHTpbDno-xU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE3/MTM4MjYzMy92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tYW5v/bnltb3VzLXBlcnNv/bi1zeW1ib2wtYmxh/bmstYXZhdGFyLWdy/YXBoaWMtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9WndPRjZOZk9S/MHpoWUM0NHhPWDA2/cnlJUEFVaER2QWFq/clBzYVo2djEtdz0"} alt=""  className='w-[35px] aspect-[1/1] rounded-full'/>
                <div className='flex flex-col leading-5 text-white'>
                    <p >{user.fullName}</p>
                    {
                        (onlineUsers|| []).includes(user._id) ?(<span className='text-green-400 text-xs'>online</span  >):(<span className='text-neutral-400 text-xs'>offline</span>)
                    }

                </div>

                {unseenMessages[user._id] >0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-black-500'> {unseenMessages[user._id]}</p>}
            </div>
        ))}


    </div>
    </div>
  )
}

export default Sidebar
