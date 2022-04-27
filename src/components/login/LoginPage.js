import React,{useState} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  "./LoginPage.css";
import { useNavigate } from 'react-router';
import logo2 from "../../images/logo2.png"

function LoginPage(props) {
    const navigate=useNavigate();
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const userPrefix=process.env.REACT_APP_USER_PREFIX;
    const saveToLocal=(token)=>{
        localStorage.setItem('token',token);
    }
    const successHandler=(result)=>{
        saveToLocal(result.token);
        navigate('/admin');
        window.location.reload(false);
    }
    const failurehandler=(result)=>{
        toast.error(result.detail,{autoClose:3000});
    }
    const loginClickHandler=(event)=>{
        event.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username",username);
        urlencoded.append("password", password);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
        };

        fetch(`${baseUrl}/${userPrefix}/auth/login`, requestOptions)
        .then(response => response.json())
        .then(result =>{result.token?successHandler(result):failurehandler(result)})
        .catch(error => console.log('error', error));
    }
    return (
        <div className='loginPage'>
            <img className='image' src={logo2} alt="logo majordomo"/>
           <form className='loginForm'>
            <div className='title'>Login to admin/staff portal</div>
               <input type="text" placeholder='Username' onChange={(event)=>setUsername(event.target.value)}/>
               <input className='password' type="password" placeholder='Password' onChange={(event)=>setPassword(event.target.value)}/>
               <button onClick={loginClickHandler}>Login</button>
           </form> 
        </div>
    );
}

export default LoginPage;