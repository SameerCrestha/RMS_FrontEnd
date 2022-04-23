import React, { useCallback, useState } from 'react';
import './NewFood.css'
function NewFood({setOverlay,createFood}) {
    const [foodName,setFoodName]=useState('');
    const [category,setCategory]=useState('')
    const [price,setPrice]=useState('');
    const buttonClickHandler=useCallback((e)=>{
        e.preventDefault();
        console.log("called")
        createFood({food_name:foodName,food_category:category,food_price:price}).then(res=>{
            setOverlay(false);
        })
        // setOverlay(false);
    },[setOverlay,foodName,category,price,createFood])
    return (
        <div className='newFoodOverlay'>
            
            <form>
                <div className='title'>Add an item</div>
                <input className='' placeholder='Food name' onChange={(e)=>setFoodName(e.target.value)} />
                <input className='' placeholder='Category' onChange={(e)=>setCategory(e.target.value)} />
                <input className='' placeholder='Price' onChange={(e)=>setPrice(e.target.value)} />
                <button className='' onClick={buttonClickHandler}>Add</button>
            </form>
        </div>
    );
}

export default NewFood;