import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ring } from 'react-awesome-spinners'
import { useNavigate } from 'react-router';

function SideBar(props) {
    let navigate=useNavigate();
    const [loaded,setLoaded]=useState(false);
    var profile=useRef();
    const fetchProfile=useCallback(()=>{
        const baseUrl=process.env.REACT_APP_BASE_URL;
        const userPrefix=process.env.REACT_APP_USER_PREFIX;
        const token=localStorage.getItem('token');
        const successHandler=(result)=>{
            profile.current=result;
            setLoaded(true);
        }
        const failureHandler=(result)=>{
            toast.error(result.detail,{autoClose:3000,hideProgressBar:true});
            setTimeout(()=>{localStorage.clear();window.location.reload(false);},1000);

        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(`${baseUrl}/${userPrefix}/profile`, requestOptions)
        .then(response => response.json())
        .then(result => result.username?successHandler(result):failureHandler(result))
        .catch(error => console.log('error', error));
    },[]);

    useEffect(()=>{
        fetchProfile();
    },[fetchProfile])

    return (
        <div className='sideBar'>
        {loaded?<>
            <p className='name'> {profile.current.full_name}</p>
            <p className='role'>{profile.current.staff}</p>
            <div className='button'><Link to='/admin'>Home</Link></div>
            {profile.current.staff.toLowerCase()==="cashier"?<div className='button'><Link to='/admin/cashierorder'>Orders</Link></div>:""}
            {profile.current.staff.toLowerCase()==="admin"?<div className='button'><Link to='/admin/menu'>Menu</Link></div>:""}
            {profile.current.staff.toLowerCase()==="kitchen staff"?<div className='button'><Link to='/admin/kitchenorder'>Orders</Link></div>:""}
            {profile.current.staff.toLowerCase()==="inventory staff"?<div className='button'><Link to='/admin/inventory'>Inventory</Link></div>:""}
            <div className="logoutButton button" onClick={()=>{localStorage.clear();navigate('/admin');window.location.reload(false);}}>Log Out</div>
        </>:<div className='loadingDiv'><Ring/></div>}
        </div>
    );
}

export default SideBar;