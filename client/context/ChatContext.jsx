import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
// import { set } from "mongoose";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
    const [messages,setMessages]=useState([]);
    const[users,setUsers]=useState([]);
    const[selectedUser,setSelectedUser]=useState(null);
    const[unseenMessages,setUnseenMessages]=useState({});
    const [typingUser, setTypingUser] = useState(null); // track who is typing


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
    // console.log("selected user id:", selectedUser?._id);
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



const subscribeToMessages = () => {
  if (!socket) return;

  socket.on("newMessage", (newMessage) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      newMessage.seen = true;
      setMessages((prev) => [...prev, newMessage]);
      // mark as seen on backend
      axios.put(`/api/messages/mark/${newMessage._id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // inform the sender that I've seen it
      socket.emit("markMessagesSeen", { senderId: selectedUser._id });
    } else {
      setUnseenMessages((prev) => ({
        ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
      }));
    }
  });

  //  Listen for seen updates from the other person 
  socket.on("messagesSeen", ({ seenBy }) => {
    if (selectedUser && seenBy === selectedUser._id) {
      setMessages((prev) =>
        prev.map((msg) => (msg.receiverId === seenBy ? { ...msg, seen: true } : msg))
      );
    }
  });

  // listen for typing status 
  socket.on("userTyping", ({ senderId }) => {
    if (selectedUser && senderId === selectedUser._id) {
      setTypingUser(senderId);
    }
  });

  socket.on("userStoppedTyping", ({ senderId }) => {
    if (selectedUser && senderId === selectedUser._id) {
      setTypingUser(null);
    }
  });
};

const unsubscribeFromMessages = () => {
  if (socket) {
    socket.off("newMessage");
    socket.off("messagesSeen");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
  }
};



//fn to chat with ai

const chatAi=async(messageData)=>{
     const token = localStorage.getItem("token"); 
    try{
    const {data}=await axios.post('/api/messages/ai',messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    // console.log("send: ",data);
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
        chatAi,
        typingUser,
        setTypingUser

        
       
    }

return( <ChatContext.Provider value={value}>

    {children}
</ChatContext.Provider>
)
}