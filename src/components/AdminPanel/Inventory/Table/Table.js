import React, { useCallback, useEffect, useState } from 'react';
import './Table.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify';
function Table({props}) {
    const[overlay,setOverlay]=useState(false);
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const inventoryPrefix=process.env.REACT_APP_INVENTORY_PREFIX;
    const token=localStorage.getItem('token');
    const [list,setList]=useState([]);
    const getInventoryList=useCallback(()=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${inventoryPrefix}/item-list/`, requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
    },[baseUrl,inventoryPrefix,token]);
    const createInventoryItem=useCallback((item)=>{//item={item_name:"name",item_category:"vegetables",item_price:120,item_quantity:"1 KG"}
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(item);
        console.log(raw)
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${inventoryPrefix}/item/`, requestOptions)
        .then(response => response.text())
        .then(result => result)
        .catch(error => console.log('error', error));
    },[baseUrl,inventoryPrefix,token]);
    const deleteInventoryItem=useCallback((item)=>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var raw = "";

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        function resultHandler(result){
            toast.success("Menu updated",{autoClose:1000,position: "top-center",hideProgressBar:true});
            getInventoryList().then(result=>sortListByCategory(result)).then(list=>setList(list));
        }
        fetch(`${baseUrl}//${inventoryPrefix}/item/${item.item_id}/`, requestOptions)
        .then(response => response.json())
        .then(result => {resultHandler(result)})
        .catch(error => console.log('error', error));
    },[baseUrl,inventoryPrefix,token,getInventoryList]);
    const editInventoryItem=useCallback((item,id)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        var raw = JSON.stringify(item);

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        function resultHandler(result){
            getInventoryList().then(result=>sortListByCategory(result)).then(list=>setList(list));
            toast.success("Menu Updated",{autoClose:1000,position: "top-center",hideProgressBar:true});
        }
        fetch(`${baseUrl}//${inventoryPrefix}/item/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {resultHandler(result)})
        .catch(error => console.log('error', error));
    },[baseUrl,getInventoryList,token,inventoryPrefix])
    function Header(){
        return(
            <div className='header'>
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Quantity</div>
            <FontAwesomeIcon className="addButton" icon="fa-plus"  onClick={()=>setOverlay(true)}/>
            </div>
        );
    }
    function NewItem(){
        const [name,setName]=useState('');
        const [category,setCategory]=useState('');
        const [price,setPrice]=useState('');
        const [quantity,setQuantity]=useState('');
        const buttonClickHandler=useCallback((e)=>{
            e.preventDefault();
            let item={item_name:name,item_category:category,item_price:price,item_quantity:quantity};
            createInventoryItem(item).then(res=>{
                getInventoryList().then(result=>sortListByCategory(result)).then(list=>setList(list));
                setOverlay(false);
                toast.info("Item added succesfully",{autoClose:3000});
            })
        },[category,name,price,quantity]);
        return (
            <div className='newItemOverlay'>
                <form>
                    <FontAwesomeIcon className='closeButton' icon="fa-xmark" onClick={()=>setOverlay(false)}/>
                    <div className='title'>Add an item</div>
                    <input className='' placeholder='Item name' onChange={(e)=>setName(e.target.value)} />
                    <input className='' placeholder='Category' onChange={(e)=>setCategory(e.target.value)} />
                    <input className='' placeholder='Price' onChange={(e)=>setPrice(e.target.value)} />
                    <input className='' placeholder='Quantity' onChange={(e)=>setQuantity(e.target.value)} />
                    <button className='' onClick={buttonClickHandler}>Add</button>
                </form>
            </div>
        );
    }
    const sortListByCategory=(list)=>{
        let tempList=[];
        let tempList2=[];
        let tempCategories=[];
        //make a list of categories in tempCategories
        for(let i=0;i<list.length;i++){
            if(!tempCategories.includes(list[i].item_category)){
                tempCategories.push(list[i].item_category);
            }
        }
        tempCategories.forEach(category=>{
            for(let i=0;i<list.length;i++){
                if(category===list[i].item_category){
                    tempList.push(list[i]);
                }
            }
        })
        tempList.forEach(el=>{
            tempList2.push(el);
        })
        return tempList2;
    }
    function Row({item}){
        const [changed,setChanged]=useState(false);
        const [name,setName]=useState(item.item_name);
        const [category,setCategory]=useState(item.item_category);
        const [price,setPrice]=useState(item.item_price);
        const [quantity,setQuantity]=useState(item.item_quantity);
        
        function trashButtonHandler(){
            deleteInventoryItem(item);
        }
        function saveButtonHandler(){
            const newItem={item_name:name,item_category:category,item_price:price,item_quantity:quantity};
            editInventoryItem(newItem,item.item_id);
            setChanged(false);
        }
        return(
            <div className='row'>
            <input type="text" className='column1' onChange={(e)=>{setName(e.target.value);setChanged(true)}} defaultValue={item.item_name}/>       
            <input type="text" className='column2' onChange={(e)=>{setCategory(e.target.value);setChanged(true)}} defaultValue={item.item_category}/>
            <input type="text" className='column3' onChange={(e)=>{setPrice(e.target.value);setChanged(true)}} defaultValue={item.item_price}/>
            <input type="text" className='column4' onChange={(e)=>{setQuantity(e.target.value);setChanged(true)}} defaultValue={item.item_quantity}/>
            {changed?
                <FontAwesomeIcon className="saveButton" icon="fa-floppy-disk" onClick={saveButtonHandler}/>
                :<FontAwesomeIcon className="trashButton" icon="fa-trash" onClick={trashButtonHandler}/>
            }
            </div>
        );
    }
    useEffect(()=>{
        getInventoryList().then(res=>sortListByCategory(res)).then(list=>setList(list));
    },[getInventoryList])
    return (
        <div className='inventoryTable'>
            {overlay?<NewItem/>:""}
            <Header/>
            {list?list.map((el,index)=>
                <Row item={el} key={el.item_id}/>
           ):"Nothing to show"} 
        </div>
    );
}

export default Table;