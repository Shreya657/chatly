import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouer from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import { Server } from 'socket.io';
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
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("user connected",userId);

    if(userId){
        userSocketMap[userId]=socket.id;
    }
    
    

    //emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    //listen for disconnection
    socket.on("disconnect",()=>{
        console.log("user disconnected",userId);
        if(userId){
            delete userSocketMap[userId];
            //emit online users to all connected clients
            io.emit("getOnlineUsers",Object.keys(userSocketMap));
        }
    });

})

//middlewares
app.use(express.json({limit:'4mb'}));
app.use(cors());

//routes setup
app.use("/api/status",(req,res)=>
res.send("API is running...")
);

app.use("/api/auth",userRouer);
app.use("/api/messages",messageRouter);


//connect to database
connectDB();


//start server
const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

