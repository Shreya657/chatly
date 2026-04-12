import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouer from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import { Server } from 'socket.io';
import User from './models/user.model.js';
// import { use } from 'react';



//create express app and http server
const app=express();
const server=http.createServer(app);



//initialize socket.io
export const io=new Server(server,{
    cors:{origin:"*"}
})

//store online users
export const userSocketMap={}; //userId:socketId

//socket connection
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
        // Attach userId to the socket object so we can use it in disconnect
        socket.userId = userId; 
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //  TYPING EVENTS 
    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            // use .to() to send only to the specific person
            io.to(receiverSocketId).emit("userTyping", { senderId: socket.userId });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", { senderId: socket.userId });
        }
    });

    // If you used io.emit, every single user on your app would see "User is typing..." even if they weren't chatting with that person. By using io.to(), we ensure only the person you are actually chatting with gets the notification.

    //  DISCONNECT (With Last Seen) 
    socket.on("disconnect", async () => {
        console.log("user disconnected", userId);
        if (userId) {
            // update the user's lastSeen timestamp 
            try {
                await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
            } catch (err) {
                console.error("Error updating lastSeen:", err);
            }

            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

//middlewares
app.use(express.json({limit:'4mb'}));
app.use(cors());

//routes setup
app.use("/api/status",(req,res)=>
res.send("API is running...")
);

app.use("/api/auth",userRouer);
app.use("/api/messages",messageRouter);



//  THE ERROR MIDDLEWARE  
app.use((err, req, res, next) => {
    // determine status code and message from ApiError class
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[API Error] ${statusCode} - ${message}`);

    // sends the JSON that Axios is looking for
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
});




//connect to database
connectDB();


//start server
if(process.env.NODE_ENV!=="production"){
const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
}


//export server for vercel
export default server;


