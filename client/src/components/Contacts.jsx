// It will contain all the users in the database and will display the name and profile of them. Also display the name and profile pic of logged in user.  It is the left side of the chat page

import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import logo from "../assets/logo2.png";
import Logout from './Logout';


export default function Contacts({contacts,currentUser,changeChat}) {
  const [currentUserName,setCurrentUserName]=useState(undefined);
  const [currentUserImage,setCurrentUserImage]=useState(undefined);
  const [currentSelected,setCurrentSelected]=useState(undefined);  // used to change the background color of the selected contact

  useEffect(()=>{
    // console.log(contacts);
    if(currentUser){
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  },[currentUser]);
  const changeCurrentChat=(index,contact)=>{
    setCurrentSelected(index);
    changeChat(contact);
  }
  return (
    <>
      {
        currentUserImage && currentUserName && (<Container>
          <div className='brand'>
            <img src={logo} alt="logo" />
            <h3>ChatVerse</h3>
          </div>
          <div className='contacts'>
            {
              contacts.map((contact,index)=>{
                return (
                  <div className={`contact ${index===currentSelected?"selected":""}`} onClick={()=>changeCurrentChat(index,contact)} key={index}>
                    <div className='avatar'>
                      <img src={`data:image/svg+xml;base64,${contact.avatarImage }`} alt="avatar"/>
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="currentUser">
            <div className='user-profile'>
              <div className='avatar'>
                <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar"/>
              </div>
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div>
            <div>
              <Logout />
            </div>
          </div>
        </Container>)
      }
    </>
  )
}

const Container=styled.div`
  display:grid;
  grid-template-rows:10% 80% 10%;
  overflow:auto;
  background-color:#F0F8FF;
  .brand{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:1rem;
    img{
      height:2rem;
    }
    h3{
      color:black;
      text-transform:uppercase;
    }
  }
  .contacts{
    display:flex;
    flex-direction:column;
    align-items:center;
    overflow:auto;
    gap:0.8rem;
    &::-webkit-scrollbar{
      width:0.2rem;
      &-thumb{
        background-color:#ffffff39;
        width:0.1rem;
        border-radius:1rem;
      }
    }
    .contact{
      background-color:#F2F3F4;
      min-height:5rem;
      width:90%;
      cursor:pointer;
      border-radius:0.2rem;
      padding:0.4rem;
      gap:1rem;
      display:flex;
      align-items:center;
      transition: 0.5s ease-in-out;
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
    .selected{
      background-color:#9186f3;
    }
  }
    .currentUser{
      padding:1rem; 
      background-color:#D3D3D3;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:2rem;
      .avatar{
        img{
          height:4rem;
          max-inline-size:100%;
        }
      }
      .username{
        h2{
          color:#9966cc;
        }
      }
       @media screen and (min-width:720px) and(max-width:1080px){
        gap:0.5rem;
        .username{
          h2{
            font-size:1rem;
          }
        }
    }
    }
    .user-profile{
      display:flex;
      justify-content:center;
      align-items:center;
      gap:1rem;
    }
    @media screen and (min-width:0px) and (max-width:650px){
      transform: scale(0.75);
    }
`;
