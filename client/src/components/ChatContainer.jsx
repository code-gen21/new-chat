// It is the section that will display the chats with the selected user.  It is the right side of chat page

import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import Logout from './Logout';
import axios from 'axios';
import {v4 as uuidv4} from "uuid";
import { sendMessageRoute,getAllMessagesRoute } from '../utils/APIRoutes';
import {BiArrowBack} from 'react-icons/bi'
import { useNavigate } from 'react-router-dom';
import chatBackground from '../assets/chatBackground.jpg';

export default function ChatContainer({currentChat,currentUser,socket,removeCurrentChat}) {

    const [messages,setMessages]=useState([]);
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const scrollRef=useRef();

    const navigate=useNavigate();

    useEffect(()=>{(async()=>{
        if(currentChat){
        const response=await axios.post(getAllMessagesRoute,{
            from:currentUser._id,
            to:currentChat._id,
        });
        setMessages(response.data);
    }
    })();
},[currentChat])

    const handleSendMsg=async (msg)=>{
        await axios.post(sendMessageRoute,{
            from:currentUser._id,
            to:currentChat._id,
            message:msg,
        });
        socket.current.emit("send-msg",{
            to:currentChat._id,
            from:currentUser._id,
            message:msg,
        });
        const msgs=[...messages];
        msgs.push({fromSelf:true,message:msg});
        setMessages(msgs);
    }

    useEffect(()=>{
        if(socket.current){
            socket.current.on("msg-recieve",(msg)=>{
                // console.log(msg);
                setArrivalMessage({fromSelf:false,message:msg});
            })
        }
    },[])

    useEffect(()=>{
        arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage])
    },[arrivalMessage])

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behaviour:"smooth"});
    },[messages]);

    const handleBack=()=>{
        removeCurrentChat();
    }


  return<Container>


    <div className="chat-header">
        <div onClick={handleBack}><BiArrowBack/></div>
        <div className="user-details">
            <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage }`} alt="avatar"/>
            </div>
            <div className="username">
                <h3>{currentChat.username}</h3>
            </div>
        </div>
        <Logout />
    </div>
   
    <div className="chat-messages">
        {
            messages.map((message)=>{
                return(
                    <div ref={scrollRef} key={uuidv4()}>
                        <div className={`message ${message.fromSelf?"sended":"recieved"}`}>
                        <div className="content">
                            <p>
                                {message.message}
                            </p>
                        </div>
                        </div>
                    </div>
                )
            })
        }
    </div>

    <ChatInput handleSendMsg={handleSendMsg} />


  </Container>
}

const Container=styled.div`
    display:grid;
    grid-template-rows:8% 84% 8%;
    gap:0.1rem;
    overflow:hidden;
    @media screen and (min-width:720px) and(max-width:1080px){
      grid-template-columns:15% 70% 15%;
    }
    background:url(${chatBackground});
    .back-button{
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:0.5rem;
    padding:0.5rem;
  
    border:none;
    cursor:pointer;
        svg{
            font-size:1.3rem;
            color:black;
        }
    }
   
    .chat-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0 2rem;
        background-color:#d4dce6;
        .user-details{
            display:flex;
            align-items:center;
            gap:1rem;
            .avatar{
                img{
                    height:3rem;
                }
            }
            .username{
                h3{
                    color:black;
                }
            }
        } 
    }
    .chat-messages{
        padding:1rem 1rem;
        display:flex;
        flex-direction:column;
        gap:1rem;
        overflow:auto;
        &::-webkit-scrollbar{
            width:0.2rem;
            &-thumb{
                background-color:black;
                width:0.1rem;
                border-radius: 1rem;
            }
        }
        .message{
            display:flex;
            align-items:center;
            .content{
                max-width:40%;
                overflow-wrap:break-word;
                padding:1rem;
                font-size:1.1rem;
                border-radius:1rem;
                color:white;
            }
        }
        .sended{
            justify-content:flex-end;
            .content{
            background-color:#EDEADE;
            color:black;
            }
        }
        .recieved{
            justify-content:flex-start;
            .content{
                background-color:white;
                color:black;
            }
        }
    }
    @media screen and (min-width:0px) and (max-width:650px){
        width:100vw;
        transform: scale(0.75);
      }
`;
