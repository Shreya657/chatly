import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
    const [messages,setMessages]=useState([]);
    const[users,setUsers]=useState([]);
    const[selectedUser,setSelectedUser]=useState(null);
    const[unseenMessages,setUnseenMessages]=useState({});


    const {socket,axios}=useContext(AuthContext);


    //fn to get all users for sidebar
 const getUsers = async () => {
  try {
    const token = localStorage.getItem("token"); // get token from storage
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    const { data } = await axios.get("/api/messages/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // console.log("getUsers data: ", data);

    if (data.success) {
      setUsers(data.data.data);
      setUnseenMessages(data.data.unseenMessages || {});
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error(error.response?.data?.message || error.message);
  }
};



    //fn to get messages for selected user
    const getMessages=async(userId)=>{
         const token = localStorage.getItem("token"); 
                   console.log("token from localStorage:", token);

        try{
           const {data}= await axios.get(`/api/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
          //  console.log("messages: ",data);
           if(data.success){
            setMessages(data.data);
           }
        }catch(error){
             toast.error(error.message);
        }
    }


   const clearChat = async () => {
    const token = localStorage.getItem("token"); 
    // console.log("clear token: ",token);
    console.log("selected user id:", selectedUser?._id);
    try {
        const { data } = await axios.delete(`/api/messages/clear/${selectedUser._id}`,  {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log("data for clear: ", data);
        setMessages([]);
        toast.success("Chat cleared!");
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to clear chat");
    }
};



    //fn to send msg to selected user
    const sendMessage=async(messageData)=>{
          const token = localStorage.getItem("token"); 
        //   console.log("token from localStorage:", token);

        try{
            const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    // console.log("send: ",data);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.data])
            }
            else{
                toast.error(data.message);
            }
        }catch(error){
                            toast.error(error.message);

        }
    }


    //fn to subscribe to message for selected user
    const subscribeToMessages=async()=>{
        if(!socket){
            return;
        }
        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderId===selectedUser._id){
                newMessage.seen=true;
                setMessages((prevMessages)=>[...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId]: prevUnseenMessages[newMessage.senderId]?prevUnseenMessages[newMessage.senderId]+1:1
                }))
            }

        })
    }


    //fn to unsubscribe from messages
    const unsubscribeFromMessages  =async()=>{
 if(socket){
    socket.off("newMessage");
 }
}



//fn to chat with ai

const chatAi=async(messageData)=>{
     const token = localStorage.getItem("token"); 
    try{
    const {data}=await axios.post('/api/messages/ai',messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    console.log("send: ",data);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.data.userMsg,  data.data.aiMsg])
            }
            else{
                toast.error(data.message);
            }
    }catch(error){
        console.error(error.message);
    }
}
 useEffect(()=>{
    subscribeToMessages();
    return ()=>unsubscribeFromMessages();
 },[socket,selectedUser])
    



    const value={
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages,
        clearChat,
        chatAi

        
       
    }

return( <ChatContext.Provider value={value}>

    {children}
</ChatContext.Provider>
)
}