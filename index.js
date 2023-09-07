const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const userRoutes=require("./routes/userRoutes");
const messageRoute=require('./routes/messagesRoutes');
const socket=require("socket.io");
// import {Server} from "socket.io";

const path=require("path");

const app=express();
require('dotenv').config();

app.use(cors());  // using app.use middleware

app.use(express.json()); 

app.use("/api/auth",userRoutes);

app.use("/api/messages",messageRoute);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true, 
}).then(()=>{
    console.log("DB connection successfully"); 
}).catch((err)=>{
    console.log(err.message);
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`);
});

const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true,
    },
});

global.onlineUsers=new Map(); // Here we will store all the online users.

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{  // event
        onlineUsers.set(userId,socket.id);
    });
    socket.on("send-msg",(data)=>{  // event
        // console.log("sendmsg",{data});
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    })
})



app.use(express.static(path.join(__dirname,"./client/build")));
app.get("*",function(_,res){
  res.sendFile(
    path.join(__dirname,"./client/build/index.html"),
    function(err){
      res.status(500).send(err);
        }
        );
});