import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io,userSocketMap } from "../server.js";
import User from "../models/user.model.js";
import OpenAI from "openai";







const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


//get all users except logged in user
const getUsersForSidebar=asyncHandler(async(req,res)=>{
const userId=req.user._id;
const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password").sort({fullName:1});
if(!filteredUsers){
    throw new ApiError(404,"No users found")
}

//count no of msgs not seen
const unseenMessages={};
const promises=filteredUsers.map(async(user)=>{
    const messages=await Message.find({
        senderId:user._id,
        receiverId:userId,
        seen:false
    });
    if(messages.length>0){
        unseenMessages[user._id]=messages.length;
    }
});

await Promise.all(promises);
return res.status(200).json(
    new ApiResponse(200, { data: filteredUsers, unseenMessages },"Users fetched successfully")
);
   

});


//get all msgs for selected user
const getMessages=asyncHandler(async(req,res)=>{
    const {id:selectedUserId}=req.params;
    if(!selectedUserId){
        throw new ApiError(400,"Selected user id is required")
    }

    const myId=req.user._id;
    const messages=await Message.find({
        $or:[
            {
                senderId:myId,
                receiverId:selectedUserId,
            },
            {
                senderId:selectedUserId,
                receiverId:myId,
            }
        ],
         hiddenFor: { $ne: myId } // Exclude messages hidden for current user
}).sort({ createdAt: 1 }); // Sorts messages by creation time (ascending = oldest first).
    
    await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true});
    return res.status(200).json(
        new ApiResponse(200,messages,"Messages fetched successfully")
    )
});


//api to mark message as seen using message id
const marksMessageAsSeen=asyncHandler(async(req,res)=>{
    
    const {id}=req.params;
    if(!id){
        throw new ApiError(400,"Message id is required")
    }
    const message=await Message.findByIdAndUpdate(id,{seen:true});
    if(!message){
        throw new ApiError(404,"Message not found")
    }
    return res.status(200).json(
        new ApiResponse(200,message,"Message marked as seen successfully")
    );
});


//send msg to selected user
const sendMessage=asyncHandler(async(req,res)=>{
const {text,image}=req.body;
const receiverId=req.params.id;
const senderId=req.user._id;
if(!receiverId){
    throw new ApiError(400,"Receiver id is required")
}
if(!text && !image){
    throw new ApiError(400,"Message text or image is required")
}
let imageUrl;
if(image){
    //upload image to cloudinary
    const uploadResponse=await cloudinary.uploader.upload(image);
    imageUrl=uploadResponse.secure_url;
}

const newMessage=await Message.create({
    text,
    image:imageUrl,
    senderId:senderId,
    receiverId
});

//emit the message to receiver if online
const receiverSocketId=userSocketMap[receiverId];
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage);
}

return res.status(201).json(
    new ApiResponse(201,newMessage,"Message sent successfully")
);
});


//clear chats 
const clearChat = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const otherUserId = req.params.id;

  if (!otherUserId) {
    throw new ApiError(400, "Selected user id is required");
  }

  // Update messages where current user is sender or receiver, add userId to hiddenFor
  await Message.updateMany(
    { 
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ],
      hiddenFor: { $ne: userId } // Only add if not already hidden
    },
    { $push: { hiddenFor: userId } }
  );

  return res.status(200).json(new ApiResponse(200, null, "Chat cleared for you!"));
});


//chat with ai
const chatWithAi=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {text}=req.body;
      if (!text) {
    throw new ApiError(400, "Message text is required");
  }

    // save user's message
  const userMsg = await Message.create({
    senderId: userId,
    receiverId: process.env.AI_BOT_ID, // put fixed AI id in .env
    text,
  });
  
    let aiText;

 try {
      // call OpenAI
     const response = await openai.chat.completions.create({
       model: "gpt-4o-mini",
       messages: [
         { role: "system", content: "You are a helpful AI assistant inside a chat app." },
         { role: "user", content: text },
       ],
     });
   
        aiText = response.choices[0].message.content;
 } catch (error) {
     console.log("OpenAI failed, using mock reply:", err.message);
  aiText = `AI says: I can't answer right now, but you said "${text}"`;
 }

      // save AI reply
  const aiMsg = await Message.create({
    senderId: process.env.AI_BOT_ID,
    receiverId: userId,
    text: aiText,
  });

    return res.status(200).json(
    new ApiResponse(200, { userMsg, aiMsg }, "AI replied successfully")
  );

})





export {getUsersForSidebar,getMessages,marksMessageAsSeen,sendMessage,clearChat,chatWithAi};