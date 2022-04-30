import React, { useState } from 'react';
import './ChangePassword.css'
import {toast} from 'react-toastify'
function ChangePassword(props) {
    const[oldpw,setOldpw]=useState('');
    const[newpw,setNewpw]=useState('');
    const[confirmpw,setConfirmpw]=useState('');
    const token=localStorage.getItem('token');
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const userPrefix=process.env.REACT_APP_USER_PREFIX;
    function changePassword(oldpw,newpw,confirmpw){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "old_password": oldpw,
        "new_password": newpw,
        "confirm_password": confirmpw
        });

        var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${userPrefix}/change-password`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    }
    function changeButtonHandler(){
        changePassword(oldpw,newpw,confirmpw).then(res=>toast.info(res.detail));
    }
    return (
        <div className='changePassword'>
            <input type="password" placeholder='Old Password' onChange={e=>setOldpw(e.target.value)}/>
            <input type="password" placeholder='New Password' onChange={e=>setNewpw(e.target.value)}/>
            <input type="password" placeholder='Confirm Password' onChange={e=>setConfirmpw(e.target.value)}/>
            <div onClick={changeButtonHandler} className='changeButton'>Change Password</div>
        </div>
    );
}

export default ChangePassword;