import React, { useState } from 'react';
import './Table.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Row({item,index,setMenuList,menuList,setRerender,editFood,deleteFood}){
    const [changed,setChanged]=useState(false);
    const [foodName,setFoodName]=useState(item.food_name);
    const [foodCategory,setFoodCategory]=useState(item.food_category);
    const [foodPrice,setFoodPrice]=useState(item.food_price);
    function trashButtonHandler(){
        deleteFood(item);
    }
    function saveButtonHandler(){
        const newFood={food_name:foodName,food_category:foodCategory,food_price:foodPrice};
        editFood(newFood,item.food_id);
        setChanged(false);
    }
    return(
        <div className='row'>
        <input type="text" className='column1' onChange={(e)=>{setFoodName(e.target.value);setChanged(true)}} defaultValue={item.food_name}/>       
        <input type="text" className='column2' onChange={(e)=>{setFoodCategory(e.target.value);setChanged(true)}} defaultValue={item.food_category}/>
        <input type="text" className='column3' onChange={(e)=>{setFoodPrice(e.target.value);setChanged(true)}} defaultValue={item.food_price}/>
        {changed?
            <FontAwesomeIcon className="saveButton" icon="fa-floppy-disk" onClick={saveButtonHandler}/>
            :<FontAwesomeIcon className="trashButton" icon="fa-trash" onClick={trashButtonHandler}/>
        }
        </div>
    );
}

function Header({createFood,deleteFood,setMenuList,menuList}){
    const defaultFood={food_name:"noname",food_category:"none",food_price:0}
    return(
        <div className='header'>
        <div>Name</div>
        <div>Category</div>
        <div>Price</div>
        <FontAwesomeIcon className="addButton" icon="fa-plus"  onClick={()=>{createFood(defaultFood)}}/>
        </div>
    );
}
function Table({createFood,menuList,deleteFood,editFood,setMenuList}) {
    const [rerender,setRerender]=useState(true);
    return (
        <div className='menuTable'>
            <Header createFood={createFood} menuList={menuList} deleteFood={deleteFood} setMenuList={setMenuList}/>
           {(menuList&&rerender)?menuList.map((el,index)=>
                <Row item={el} key={el.food_id} menuList={menuList} editFood={editFood} setRerender={setRerender} index={index} setMenuList={setMenuList} deleteFood={deleteFood}/>
           ):"Nothing to show"} 
        </div>
    );
}

export default Table;