import React, { useEffect, useState } from 'react';
import './KitchenOrder.css'
function Order({order,editOrderStatus}){
    const [status,setStatus]=useState(order.status);
    function statusClickHandler(e){
        setStatus(e.target.textContent);
        editOrderStatus(order.order_id,e.target.textContent);
    }
    return <div className='order'>
    <div className='tableNumber'>Table {order.table}</div>
    <div className='orderDate'>{order.order_date}</div>
    <div className='orderList'>
    {order.note.length!==0?<div className='note'>Note:{order.note}</div>:""}
    {order.items.map(el=><div className='listItem'>
        <div className='foodName'>{el.food.food_name}</div>
        <div className='foodQuantity'>x{el.quantity}</div>
    </div>)}
    </div>
    <div className='orderStatus'>
    <div className={status==="Received"?"active":"notActive"} onClick={statusClickHandler}>Received</div>
    <div className={status==="Preparing"?"active":"notActive"} onClick={statusClickHandler}>Preparing</div>
    <div className={status==="Prepared"?"active":"notActive"} onClick={statusClickHandler}>Prepared</div>
    </div>
    </div>
}
function KitchenOrder(props) {
    const[order,setOrder]=useState([]);
    const baseUrl=process.env.REACT_APP_BASE_URL;
    const orderPrefix=process.env.REACT_APP_ORDER_PREFIX;
    const token=localStorage.getItem('token');
    function getPendingOrders(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        return fetch(`${baseUrl}//${orderPrefix}/`, requestOptions)
        .then(response => response.json())
        .then(result => result.filter(el=>el.status!=="Cancelled"&&el.status!=="Paid"))
        .catch(error => console.log('error', error));
    }
    function editOrderStatus(id,status){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        redirect: 'follow'
        };
          
          return fetch(`${baseUrl}/${orderPrefix}/${id}/${status}`, requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    useEffect(()=>{
        getPendingOrders().then(res=>setOrder(res));
    },[])
    if(order.length===0){
        return(<div>No pending order</div>)
    }else return (
        <div className='kitchenOrder'>
            {order.map((el)=><Order order={el} editOrderStatus={editOrderStatus}/>)}
        </div>
    );
}

export default KitchenOrder;