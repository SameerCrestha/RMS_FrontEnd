import React, { useState } from 'react';
import './RegisterUser.css'
import Select from 'react-select';
import {toast } from 'react-toastify'
function RegisterUser(props) {
    const[username,setUsername]=useState('');
    const[fullname,setFullname]=useState('');
    const [password,setPassword]=useState('');
    const[staff,setStaff]=useState('');
    const token=localStorage.getItem('token');
    const options = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Cashier', label: 'Cashier' },
        { value: 'Kitchen Staff', label: 'Kitchen Staff' },
        { value: 'Inventory Staff', label: 'Inventory Staff' },
      ]
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const userPrefix=process.env.REACT_APP_USER_PREFIX;
    function registerUser(username,fullname,password,staff){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "username": username,
        "full_name": fullname,
        "password": password,
        "staff": staff
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${userPrefix}/register`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
    function registerHandler(){
        console.log(staff)
        if(username.length!==0&&fullname.length!==0&&password.length!==0&&staff.length!==0)
        registerUser(username,fullname,password,staff).then(res=>toast.success(res.detail))
    }
    return (
        <div className='registerUser'>
            Register a user
            <input type='text'placeholder='Username' onChange={(e)=>{setUsername(e.target.value)}}/>
            <input type='text' placeholder='Fullname' onChange={(e)=>{setFullname(e.target.value)}}/>
            <input type='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
            <Select  options={options} onChange={e=>{setStaff(e.value)}}/>
            <div onClick={registerHandler} className="button">Register</div>
        </div>
    );
}

export default RegisterUser;