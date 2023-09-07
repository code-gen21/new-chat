import React from 'react'
import styled from 'styled-components'
import Robot from "../assets/robot.gif";
import Logout from './Logout';

export default function Welcome({currentUserVal}) {
    let windowWidth=window.innerWidth>650;
  return (
    currentUserVal && windowWidth && <Container>
        <img src={Robot} alt="Robot" />
        
        <h1>
            Welcome, <span>{currentUserVal.username}!</span>
        </h1>
        <h3>Please select a chat to start messaging</h3>
        <Logout />
    </Container>
  )
}
const Container=styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
color:white;
    img{
        height:20rem;
    }
    span{
        color:#4e0eff;
    }
`
