import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Link,useNavigate } from 'react-router-dom';
import Logo from '../assets/logo2.png';
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const navigate=useNavigate();
    const [values,setValues]=useState({
        username:"",
        password:"",
    });
    const toastOptions={
        position:"top-center",
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark"
    }

    useEffect(()=>{
            if(localStorage.getItem("chat-app-user")){
            const user=JSON.parse(localStorage.getItem("chat-app-user"));
        // console.log(user);
            if(user.isAvatarImageSet){
                navigate('/');
            }
            else{
                navigate('/setAvatar');
            }
      }
    },[])

    const handleSubmit=async (event)=>{
        event.preventDefault();
        if(handleValidation()){
        const {password,username}=values;
            const {data}=await axios.post(loginRoute,{
                username,password
            });
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                localStorage.setItem('chat-app-user',JSON.stringify(data.user));
                navigate('/setAvatar');
            }
        }
       
    }
    const handleValidation=()=>{
        const {password,username}=values;
        if(password===""){
            toast.error("Username and Password is required",toastOptions);
            return false;
        }
        else if(username===""){
            toast.error("Username and Password is required",toastOptions);
            return false;
        }
        return true;
    }
    const handleChange=(event)=>{
         setValues({...values,[event.target.name]:event.target.value});
    }
  return<>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="" />
                <h1>ChatVerse</h1>
            </div>
            <input type="text" placeholder="Username" name="username" onChange={(e)=>handleChange(e)} min="3"/>
            <input type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)} />
            <button type="submit">Login</button>
            <span>Don't have an account? <Link to="/register">Register</Link></span>
        </form>
    </FormContainer>
    <ToastContainer />
  </>
}

const FormContainer=styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background-color:rgb(39, 37, 31);
    .brand{
        display:flex;
        align-items:center;
        // gap:1rem;
        justify-content:center;
        img{
            height:5rem;
            background:none;
        }
        h1{
            color:black;
            text-transform:uppercase;
        }
    }
    form{
        display:flex;
        flex-direction:column;
        gap:2rem;
        background-color:white;
        border-radius:2rem;
        padding: 3rem 5rem;
        input{
            background-color:transparent;
            padding:1rem;
            border:0.2rem solid black;
            border-radius: 0.4rem;
            color:black;
            width:100%;
            font-size:1rem;
            &:focus{
                border:0.2rem solid black;
                outline:none;
            }
        }
        button{
            background-color:black;
            color:white;
            padding:1rem 2rem;
            border:none;
            font-weight:bold;
            cursor:pointer;
            border-radius:0.4rem;
            font-size:1rem;
            text-transform:uppercase;
            transition:.5s ease-in-out;
            &:hover{
                background-color:rgb(39, 37,102);
            }
        }
        span{
            color:black;
            text-transform:uppercase;
            a{
                color:red;
                text-decoration:none;
                font-weight:bold;
            }
        }
    }
`;

export default Login;