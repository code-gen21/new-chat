// It will contain the overall layout after login. It will contain the all contacts and also the area where the messages for a particular chat will be displayed



import React, {useState, useEffect,useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute,host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";
import {BiPowerOff} from 'react-icons/bi';


function Chat() {

  const socket=useRef();

  const navigate=useNavigate();
  const [contacts,setContacts]=useState([]);
  const [currentUser,setCurrentUser]=useState(undefined);
  const [currentChat,setCurrentChat]=useState(undefined);

  useEffect(()=>{(async()=>{
    if(!localStorage.getItem("chat-app-user")){
      navigate('/login');
    } else{
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
    }
  })();
},[])

  useEffect(()=>{
    if(currentUser){
      socket.current=io(host);
      socket.current.emit("add-user",currentUser._id);
    }
  },[currentUser])
  
  useEffect(()=>{(async()=>{
    if(currentUser){
      if(currentUser.isAvatarImageSet){
        const data=await axios.get(`${allUsersRoute}/${currentUser._id}`)
        setContacts(data.data);
        // console.log(data);
      }
      else{
        navigate('/setAvatar');
      }
    }})();
  },[currentUser])
  
  const handleChatChange=(chat)=>{
      setCurrentChat(chat);   // used to change selected chat in contact.jsx
  }
  const removeCurrentChat=()=>{
    setCurrentChat(undefined);
  }

  return (
      <Container>
        <div className={(window.innerWidth<=650 && currentChat===undefined?'only-contacts':'container')}>
          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
          {
            currentChat===undefined?(<Welcome currentUserVal={currentUser} />):(<ChatContainer currentChat={currentChat} removeCurrentChat={removeCurrentChat} currentUser={currentUser} socket={socket} />)
          }
          
        </div>
      </Container>
  )
}

const Container=styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background-color:#7CB9E8;
  .container{
    height:85vh;
    width:85vw;
    background-color:#E5E4E2;
    display:grid;
    grid-template-columns:25% 75%;
    @media screen and (min-width:720px) and(max-width:1080px){
      grid-template-columns:35% 65%;
    }
    @media screen and (max-width:1080px){
      width:95vw;
      grid-template-columns:40% 60%;
    }
    @media screen and (max-width:650px){
      width:100vw;
      height:100vh;
      grid-template-columns:0 100%;
    }
  }
  .only-contacts{
    width:100vw;
    height:100vh;
    display:grid;
    grid-template-columns:100% 0;
  }
`;

export default Chat