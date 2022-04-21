import React, { useCallback, useEffect, useState } from 'react';
import Table from './Table';
import { toast } from 'react-toastify';

function Menu(props) {
    const [loaded,setLoaded]=useState(false);
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const foodPrefix=process.env.REACT_APP_FOOD_PREFIX;
    const token=localStorage.getItem('token');
    const [menuList,setMenuList]=useState('');
    const getMenuList=useCallback(
        ()=>{
            var myHeaders = new Headers();
    
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };
    
            fetch(`${baseUrl}//${foodPrefix}/menu-list/`, requestOptions)
            .then(response => response.json())
            .then(result => {setMenuList(result);setLoaded(true);})
            .catch(error => console.log('error', error));
        },[baseUrl,foodPrefix]
    );
    const createFood=(fooditem)=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(fooditem);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        function successHandler(result){
            toast.info("Item added succesfully",{autoClose:3000});
            setMenuList(menuList.push(result));
        }
        console.log("i m called")

        fetch(`${baseUrl}//${foodPrefix}/menu/`, requestOptions)
        .then(response => response.json())
        .then(result =>{successHandler(result)})
        .catch(error => console.log('error', error));
    }
    const deleteFood=(item)=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
    
        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
        };
        
        function successHandler(result){
            toast.info(result.detail,{autoClose:1000,position: "top-center",hideProgressBar:true});
             getMenuList();
        }

        fetch(`${baseUrl}//${foodPrefix}/menu/${item.food_id}/`, requestOptions)
        .then(response => response.json())
        .then(result =>{successHandler(result)})
        .catch(error => console.log('error', error));
    }
    const editFood=(item,id)=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(item);

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`${baseUrl}//${foodPrefix}/menu/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {getMenuList();toast.success("Menu Updated",{autoClose:1000,position: "top-center",hideProgressBar:true})})
        .catch(error => console.log('error', error));
    }
    useEffect(()=>{
        getMenuList();
    },[getMenuList]);
    return (
        
        <>
            {loaded?<Table editFood={editFood} createFood={createFood} setMenuList={setMenuList} deleteFood={deleteFood}  menuList={menuList}/>:<div>loading...</div>}
        </>
    );
}

export default Menu;